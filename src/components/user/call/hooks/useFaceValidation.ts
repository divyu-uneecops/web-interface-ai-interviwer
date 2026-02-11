"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/** Warning types for face validation during interview */
export type FaceWarningType =
  | "no_face"
  | "multiple_faces"
  | "face_not_visible"
  | "obstruction";

/** Thresholds */
const MIN_FACE_FRACTION = 0.12;
const EDGE_MARGIN_FRACTION = 0.05;
const CHECK_INTERVAL_MS = 400;
const WARNING_DEBOUNCE_MS = 1200;
const CLEAR_DEBOUNCE_MS = 800;

/** Head pose limits (degrees) */
const MAX_YAW = 18; // left/right
const MAX_PITCH = 15; // up/down

const WASM_BASE =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/wasm";

const FACE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export interface UseFaceValidationOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  active: boolean;
}

export interface UseFaceValidationResult {
  warning: FaceWarningType | null;
  isChecking: boolean;
  warningMessage: string | null;
}

/** User-facing messages: state + actionable fix + penalty. Helpful tone, concise. */
const WARNING_MESSAGES: Record<FaceWarningType, string> = {
  no_face:
    "We can't see your face. Look at the camera and make sure your face is in frame. This may be recorded as a penalty.",
  multiple_faces:
    "More than one face in frame. Please ensure only you are visible to the camera. This may be recorded as a penalty.",
  face_not_visible:
    "Face not clearly visible. Center your face in the frame and look at the camera. This may be recorded as a penalty.",
  obstruction:
    "Face is partially hidden. Remove obstructions and keep your full face visible. This may be recorded as a penalty.",
};

export function useFaceValidation({
  videoRef,
  active,
}: UseFaceValidationOptions): UseFaceValidationResult {
  const [warning, setWarning] = useState<FaceWarningType | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const landmarkerRef = useRef<any>(null);
  const rafRef = useRef<number>(0);
  const lastVideoTimeRef = useRef<number>(-1);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clearTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingWarningRef = useRef<FaceWarningType | null>(null);

  async function createLandmarker() {
    const { FaceLandmarker, FilesetResolver } = await import(
      "@mediapipe/tasks-vision"
    );

    const vision = await FilesetResolver.forVisionTasks(WASM_BASE);

    const landmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: FACE_MODEL_URL,
      },
      runningMode: "VIDEO",
      numFaces: 2,
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: true,
    });

    return landmarker;
  }

  const evaluateFrame = useCallback(
    (landmarker: any, video: HTMLVideoElement): FaceWarningType | null => {
      const timestamp = performance.now();
      let result;

      try {
        result = landmarker.detectForVideo(video, timestamp);
      } catch {
        return "no_face";
      }

      const faces = result.faceLandmarks ?? [];
      const matrices = result.facialTransformationMatrixes ?? [];

      const vw = video.videoWidth || 1;
      const vh = video.videoHeight || 1;

      if (faces.length === 0) return "no_face";
      if (faces.length > 1) return "multiple_faces";

      const landmarks = faces[0];

      // --- Face Size Check ---
      const xs = landmarks.map((p: any) => p.x * vw);
      const ys = landmarks.map((p: any) => p.y * vh);

      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      const width = maxX - minX;
      const height = maxY - minY;

      const fracW = width / vw;
      const fracH = height / vh;

      if (fracW < MIN_FACE_FRACTION || fracH < MIN_FACE_FRACTION)
        return "face_not_visible";

      // --- Edge Check ---
      const marginW = vw * EDGE_MARGIN_FRACTION;
      const marginH = vh * EDGE_MARGIN_FRACTION;

      if (
        minX < -marginW ||
        minY < -marginH ||
        maxX > vw + marginW ||
        maxY > vh + marginH
      )
        return "face_not_visible";

      // --- Head Pose Check ---
      if (!matrices || matrices.length === 0) return "face_not_visible";

      const matrix = matrices[0].data;

      // Extract approximate yaw & pitch from matrix
      const yaw = Math.atan2(matrix[8], matrix[0]) * (180 / Math.PI);
      const pitch = Math.asin(-matrix[9]) * (180 / Math.PI);

      if (Math.abs(yaw) > MAX_YAW || Math.abs(pitch) > MAX_PITCH)
        return "face_not_visible";

      // --- Obstruction Check (basic landmark presence) ---
      const nose = landmarks[1];
      const mouth = landmarks[13];

      if (!nose || !mouth) return "obstruction";

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
        if (!landmarkerRef.current) {
          landmarkerRef.current = await createLandmarker();
        }
        if (!cancelled) setIsChecking(false);
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
    if (!active || isChecking || !landmarkerRef.current || !videoRef.current) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    let lastCheckTime = 0;

    function tick() {
      if (!videoRef.current || !landmarkerRef.current || !active) return;

      const videoEl = videoRef.current;
      if (!videoEl.videoWidth) {
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

      const nextWarning = evaluateFrame(landmarkerRef.current, videoEl);

      if (nextWarning !== null) {
        pendingWarningRef.current = nextWarning;

        if (!warningTimeoutRef.current) {
          warningTimeoutRef.current = setTimeout(() => {
            setWarning(pendingWarningRef.current);
            warningTimeoutRef.current = null;
          }, WARNING_DEBOUNCE_MS);
        }
      } else {
        pendingWarningRef.current = null;

        if (warningTimeoutRef.current) {
          clearTimeout(warningTimeoutRef.current);
          warningTimeoutRef.current = null;
        }

        if (warning !== null && !clearTimeoutRef.current) {
          clearTimeoutRef.current = setTimeout(() => {
            setWarning(null);
            clearTimeoutRef.current = null;
          }, CLEAR_DEBOUNCE_MS);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);
    };
  }, [active, isChecking, evaluateFrame, warning]);

  return {
    warning,
    isChecking,
    warningMessage: warning ? WARNING_MESSAGES[warning] : null,
  };
}
