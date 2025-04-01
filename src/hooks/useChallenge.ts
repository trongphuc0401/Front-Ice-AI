import { useState } from "react";
import {
  generateChallengeIdAndSolutionId,
  ChallengeResponse,
} from "../services/api";

export const useChallenge = () => {
  const [challengeData, setChallengeData] = useState<ChallengeResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChallengeIds = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await generateChallengeIdAndSolutionId();
      setChallengeData(data);
      return data;
    } catch (err) {
      setError("Failed to generate challenge IDs");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    challengeData,
    loading,
    error,
    fetchChallengeIds,
  };
};
