"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/** Warning types for face validation during interview */
export type FaceWarningType =
  | "no_face"
  | "multiple_faces"
  | "face_not_visible"
  | "obstruction";

/** Thresholds for face validation */
const MIN_FACE_FRACTION = 0.12; // face bbox at least 12% of frame width/height
const EDGE_MARGIN_FRACTION = 0.05; // bbox should be at least 5% away from frame edges
const MIN_DETECTION_CONFIDENCE = 0.6; // treat low confidence as possible obstruction
const FRONTAL_ASPECT_RATIO_MIN = 0.65; // bbox aspect ratio (w/h) for "facing camera"
const FRONTAL_ASPECT_RATIO_MAX = 1.5;
const CHECK_INTERVAL_MS = 400; // run detection every ~400ms to avoid blocking UI
const WARNING_DEBOUNCE_MS = 1200; // show warning after condition persists 1.2s
const CLEAR_DEBOUNCE_MS = 800; // clear warning after OK for 0.8s

const WASM_BASE =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/wasm";
const FACE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite";

export interface UseFaceValidationOptions {
  /** Video element to run face detection on (e.g. user's camera) */
  videoRef: React.RefObject<HTMLVideoElement | null>;
  /** Whether validation is active (e.g. interview started, tips modal closed) */
  active: boolean;
}

export interface UseFaceValidationResult {
  /** Current warning to show, or null if OK */
  warning: FaceWarningType | null;
  /** Whether the detector is still loading */
  isChecking: boolean;
  /** Human-readable message for the current warning */
  warningMessage: string | null;
}

const WARNING_MESSAGES: Record<FaceWarningType, string> = {
  no_face:
    "Face not detected. Please face the camera directly with your full face visible.",
  multiple_faces:
    "Only one person should be in frame. Please ensure no one else is visible.",
  face_not_visible:
    "Ensure your full face is visible and you are facing the camera directly.",
  obstruction:
    "Keep your face clearly visible with no masks or obstructions during the interview.",
};

export function useFaceValidation({
  videoRef,
  active,
}: UseFaceValidationOptions): UseFaceValidationResult {
  const [warning, setWarning] = useState<FaceWarningType | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const detectorRef = useRef<Awaited<ReturnType<typeof createDetector>> | null>(
    null
  );
  const rafRef = useRef<number>(0);
  const lastVideoTimeRef = useRef<number>(-1);
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingWarningRef = useRef<FaceWarningType | null>(null);

  async function createDetector() {
    const { FaceDetector, FilesetResolver } = await import(
      "@mediapipe/tasks-vision"
    );
    const vision = await FilesetResolver.forVisionTasks(WASM_BASE);
    const detector = await FaceDetector.createFromOptions(vision, {
      baseOptions: { modelAssetPath: FACE_MODEL_URL },
      runningMode: "VIDEO",
      minDetectionConfidence: 0.5,
    });
    return detector;
  }

  const evaluateFrame = useCallback(
    (
      detector: Awaited<ReturnType<typeof createDetector>>,
      video: HTMLVideoElement
    ): FaceWarningType | null => {
      const timestamp = performance.now();
      let result: {
        detections: Array<{
          boundingBox?: {
            originX: number;
            originY: number;
            width: number;
            height: number;
          };
          categories?: Array<{ score: number }>;
        }>;
      };
      try {
        result = detector.detectForVideo(video, timestamp);
      } catch {
        return "no_face";
      }

      const detections = result.detections ?? [];
      const vw = video.videoWidth || 1;
      const vh = video.videoHeight || 1;

      if (detections.length === 0) return "no_face";
      if (detections.length > 1) return "multiple_faces";

      const d = detections[0];
      const score = d.categories?.[0]?.score ?? 0;
      if (score < MIN_DETECTION_CONFIDENCE) return "obstruction";

      const box = d.boundingBox;
      if (!box) return "face_not_visible";

      const { originX, originY, width, height } = box;
      const fracW = width / vw;
      const fracH = height / vh;

      if (fracW < MIN_FACE_FRACTION || fracH < MIN_FACE_FRACTION)
        return "face_not_visible";

      const marginW = vw * EDGE_MARGIN_FRACTION;
      const marginH = vh * EDGE_MARGIN_FRACTION;
      if (
        originX < -marginW ||
        originY < -marginH ||
        originX + width > vw + marginW ||
        originY + height > vh + marginH
      )
        return "face_not_visible";

      const aspectRatio = width / (height || 1);
      if (
        aspectRatio < FRONTAL_ASPECT_RATIO_MIN ||
        aspectRatio > FRONTAL_ASPECT_RATIO_MAX
      )
        return "face_not_visible";

      return null;
    },
    []
  );

  useEffect(() => {
    if (!active) {
      setWarning(null);
      pendingWarningRef.current = null;
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        if (!detectorRef.current) {
          detectorRef.current = await createDetector();
        }
        if (cancelled) return;
        setIsChecking(false);
      } catch (e) {
        console.error("Face validation init error:", e);
        if (!cancelled) setIsChecking(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [active]);

  useEffect(() => {
    if (!active || isChecking || !detectorRef.current || !videoRef.current) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      return;
    }

    let lastCheckTime = 0;

    function tick() {
      if (!videoRef.current || !detectorRef.current || !active) return;

      const videoEl = videoRef.current;
      if (!videoEl.videoWidth || !videoEl.videoHeight) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const now = performance.now();
      if (now - lastCheckTime < CHECK_INTERVAL_MS) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      lastCheckTime = now;

      const currentTime = videoEl.currentTime;
      if (currentTime === lastVideoTimeRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      lastVideoTimeRef.current = currentTime;

      const nextWarning = evaluateFrame(detectorRef.current, videoEl);

      if (nextWarning !== null) {
        pendingWarningRef.current = nextWarning;
        if (clearTimeoutRef.current) {
          clearTimeout(clearTimeoutRef.current);
          clearTimeoutRef.current = null;
        }
        if (!warningTimeoutRef.current) {
          warningTimeoutRef.current = setTimeout(() => {
            warningTimeoutRef.current = null;
            setWarning(pendingWarningRef.current);
          }, WARNING_DEBOUNCE_MS);
        }
      } else {
        pendingWarningRef.current = null;
        if (warningTimeoutRef.current) {
          clearTimeout(warningTimeoutRef.current);
          warningTimeoutRef.current = null;
        }
        if (warning !== null) {
          if (!clearTimeoutRef.current) {
            clearTimeoutRef.current = setTimeout(() => {
              clearTimeoutRef.current = null;
              setWarning(null);
            }, CLEAR_DEBOUNCE_MS);
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
        warningTimeoutRef.current = null;
      }
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
        clearTimeoutRef.current = null;
      }
    };
  }, [active, isChecking, evaluateFrame, warning]);

  return {
    warning,
    isChecking,
    warningMessage: warning ? WARNING_MESSAGES[warning] : null,
  };
}
