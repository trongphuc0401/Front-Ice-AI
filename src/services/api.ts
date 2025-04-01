import axios from "axios";

const API_BASE_URL =
  "https://uploadoriginalfile-d7bfg6gaf0ajehg8.canadacentral-01.azurewebsites.net/api";

export interface ChallengeResponse {
  challengeId: string;
  solutionId: string;
}

export const generateChallengeIdAndSolutionId =
  async (): Promise<ChallengeResponse> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/generateChallengeIdAndSolutionId`
      );
      return response.data;
    } catch (error) {
      console.error("Error generating challenge and solution IDs:", error);
      throw error;
    }
  };
