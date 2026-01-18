import api from "./axios.service";
import axios from "axios";

export interface LiveKitTokenResponse {
  token: string;
  url: string;
  roomName: string;
}

export interface StartInterviewResponse {
  success: boolean;
  token: string;
  room: string;
  livekitUrl: string;
  identity: string;
}

export interface StartInterviewPayload {
  applicantId: string;
  jobId: string;
  roundId: string;
  interviewerId: string;
  participantName: string;
}

/**
 * Get LiveKit token from backend API
 * This assumes your backend has an endpoint to generate LiveKit tokens
 * @param interviewId - Interview ID
 * @param participantName - Name of the participant
 * @returns LiveKit token response
 */
export async function getLiveKitTokenFromAPI(
  interviewId: string,
  participantName: string
): Promise<LiveKitTokenResponse> {
  try {
    // TODO: Update this endpoint based on your actual API
    const response = await api.post<LiveKitTokenResponse>(
      `/api/interviews/${interviewId}/livekit-token`,
      {
        participantName,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to get LiveKit token from API:", error);
    throw error;
  }
}

/**
 * Generate LiveKit token from backend API (recommended approach)
 * This should be the primary method - tokens should be generated on the backend
 * @param interviewId - Interview ID
 * @param participantName - Name of the participant
 * @returns LiveKit token and configuration
 */
export async function generateLiveKitTokenFromAPI(
  interviewId: string,
  participantName: string
): Promise<{ token: string; url: string; roomName: string }> {
  try {
    const response = await getLiveKitTokenFromAPI(interviewId, participantName);
    return response;
  } catch (error) {
    console.error("Failed to get LiveKit token from API:", error);
    throw error;
  }
}

/**
 * Start interview and get LiveKit token from local API
 * Calls localhost:8021/api/start-interview to get token and room information
 * @param payload - Interview payload with applicantId, jobId, roundId, interviewerId, and participantName
 * @returns LiveKit configuration with token from API
 */
export async function startInterviewAPI(
  payload: StartInterviewPayload
): Promise<StartInterviewResponse> {
  try {
    // Use environment variable if available, otherwise default to localhost:8021
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_INTERVIEW_API_URL || "http://localhost:8021";
    const apiUrl = `${apiBaseUrl}/api/start-interview`;

    const response = await axios.post<StartInterviewResponse>(
      apiUrl,
      {
        applicantId: payload.applicantId,
        jobId: payload.jobId,
        roundId: payload.roundId,
        interviewerId: payload.interviewerId,
        participantName: payload.participantName,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.success) {
      throw new Error("Failed to start interview");
    }

    return response.data;
  } catch (error) {
    console.error("Failed to start interview:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          `Failed to start interview: ${error.message}`
      );
    }
    throw error;
  }
}

/**
 * Generate LiveKit token configuration
 * Note: Token generation should happen on the backend for security.
 * This function fetches the token from your backend API.
 * @param payload - Interview payload with applicantId, jobId, roundId, interviewerId, and participantName
 * @returns LiveKit configuration with token from backend
 */
export async function generateLiveKitTokenLocal(
  payload: StartInterviewPayload
): Promise<{ token: string; url: string; roomName: string }> {
  try {
    // Call the start-interview API endpoint
    const response = await startInterviewAPI(payload);

    return {
      token: response.token,
      url: response.livekitUrl,
      roomName: response.room,
    };
  } catch (error) {
    console.error("Failed to fetch LiveKit token from API:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to get LiveKit token. Please ensure your backend API endpoint is running at localhost:8021/api/start-interview"
    );
  }
}
