import { useState, useCallback, useMemo } from "react";
import { generateRecommendation, getCareerRecommendation } from "@services/recommendationEngine";

/**
 * Custom hook for managing recommendation state and generation
 * @param {Object} answers - Quiz answers to generate recommendation from
 * @returns {Object} Recommendation state and handlers
 */
export function useRecommendation(answers) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Generate recommendation from answers
  const recommendation = useMemo(() => {
    if (!answers || Object.keys(answers).length === 0) return null;
    return generateRecommendation(answers);
  }, [answers]);

  // Check if recommendation is ready
  const isReady = useMemo(() => {
    return recommendation !== null && recommendation.primaryCareer !== null;
  }, [recommendation]);

  // Get career-specific recommendation
  const getCareerDetails = useCallback((careerId) => {
    if (!answers) return null;
    return getCareerRecommendation(careerId, answers);
  }, [answers]);

  // Simulate loading state for better UX
  const generateWithLoading = useCallback(async () => {
    setIsLoading(true);
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setHasGenerated(true);
    return recommendation;
  }, [recommendation]);

  return {
    // Data
    recommendation,
    isReady,
    isLoading,
    hasGenerated,

    // Actions
    generateWithLoading,
    getCareerDetails
  };
}

export default useRecommendation;