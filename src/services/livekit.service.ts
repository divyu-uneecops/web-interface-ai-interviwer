import axios from "axios";
import serverInterfaceService from "./server-interface.service";

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
  transcriptRecordId?: string;
}

export interface StartInterviewPayload {
  email: string;
  interviewId: string;
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
    const data = await serverInterfaceService.post<StartInterviewResponse>(
     'http://localhost:8021/api/start-interview',
      {},
      {
        email: payload.email,
        interviewId: payload.interviewId,
      }
    );

    if (!data.success) {
      throw new Error("Failed to start interview");
    }

    return data;
  } catch (error) { 
    throw error;
  }
}

