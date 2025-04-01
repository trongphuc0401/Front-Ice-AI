import React, { useState, useEffect } from "react";
import "../styles/FileComparison.css";
import ReactMarkdown from "react-markdown";
import { useChallenge } from "../hooks/useChallenge";
import { uploadFilesCompare, uploadFilesOriginal } from "../api/uploadApi";

interface ComparisonResult {
  similarity_percentages: {
    visual_similarity: number;
    code_similarity: number;
    final_combined_similarity: number;
  };
  deepseek_analysis: string;
  improvement_suggestions: string;
  overall_similarity_percentage: string;
  weighting_rationale: string;
}

const FileComparison: React.FC = () => {
  const [originalHtml, setOriginalHtml] = useState<File | null>(null);
  const [originalCss, setOriginalCss] = useState<File | null>(null);
  const [compareHtml, setCompareHtml] = useState<File | null>(null);
  const [compareCss, setCompareCss] = useState<File | null>(null);
  const [results, setResults] = useState<ComparisonResult | null>(null);
  const [deployedLinks, setDeployedLinks] = useState<{
    original: string;
    compare: string;
  } | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [hasGeneratedIds, setHasGeneratedIds] = useState(false);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [solutionId, setSolutionId] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const { fetchChallengeIds } = useChallenge();

  // Update useEffect to store IDs
  useEffect(() => {
    const checkAndGenerateIds = async () => {
      if (
        originalHtml &&
        originalCss &&
        compareHtml &&
        compareCss &&
        !hasGeneratedIds
      ) {
        try {
          setHasGeneratedIds(true);
          const ids = await fetchChallengeIds();
          setChallengeId(ids.challengeId);
          setSolutionId(ids.solutionId);
          console.log("Generated IDs:", ids);
        } catch (err) {
          console.error("Error generating IDs:", err);
          setUploadError("Failed to generate challenge IDs");
        }
      }
    };

    checkAndGenerateIds();
  }, [
    originalHtml,
    originalCss,
    compareHtml,
    compareCss,
    fetchChallengeIds,
    hasGeneratedIds,
  ]);

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "originalHtml" | "originalCss" | "compareHtml" | "compareCss"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      switch (type) {
        case "originalHtml":
          setOriginalHtml(file);
          break;
        case "originalCss":
          setOriginalCss(file);
          break;
        case "compareHtml":
          setCompareHtml(file);
          break;
        case "compareCss":
          setCompareCss(file);
          break;
      }
    }
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    setUploadError(null);

    try {
      if (!originalHtml || !originalCss || !compareHtml || !compareCss) {
        throw new Error("Please select all required HTML and CSS files");
      }

      if (!challengeId || !solutionId) {
        throw new Error("Challenge IDs not generated. Please try again.");
      }

      // Upload original files
      const originalResponse = await uploadFilesOriginal(
        challengeId,
        originalHtml,
        originalCss
      );

      // Upload compare files
      const compareResponse = await uploadFilesCompare(
        challengeId,
        solutionId,
        compareHtml,
        compareCss
      );

      setDeployedLinks({
        original: originalResponse.htmlUrl,
        compare: compareResponse.htmlUrl,
      });
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "An error occurred during upload"
      );
      console.error("Upload failed:", err);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCompare = async () => {
    if (isComparing) return; // Prevent multiple calls

    try {
      setIsComparing(true);
      setUploadError(null);

      if (!challengeId || !solutionId) {
        throw new Error("Challenge IDs not generated. Please try again.");
      }

      const response = await fetch(
        `${
          import.meta.env.VITE_COMPARE_AI_API_URL
        }?challengeid=${challengeId}&solutionid=${solutionId}`
      );

      if (!response.ok) {
        throw new Error("Failed to compare files");
      }

      const data = await response.json();
      console.log("API Response:", data); // Add this line for debugging

      setResults({
        similarity_percentages: data.analysis_result.similarity_percentages,
        deepseek_analysis: data.analysis_result.deepseek_analysis,
        improvement_suggestions: data.analysis_result.improvement_suggestions,
        overall_similarity_percentage:
          data.analysis_result.overall_similarity_percentage,
        weighting_rationale: data.analysis_result.weighting_rationale,
      });
    } catch (error) {
      console.error("Error comparing files:", error);
      setUploadError(
        error instanceof Error ? error.message : "Failed to compare files"
      );
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="file-comparison-container">
      <div className="header">
        <h1>Front-Ice-AI</h1>
        <p>Compare and analyze your HTML and CSS files</p>
      </div>

      <div className="projects-container">
        <div className="project-area">
          <h2>Original Project</h2>
          <div className="upload-group">
            <div className="upload-box">
              <label htmlFor="originalHtml" className="upload-label">
                Upload HTML File
                <input
                  type="file"
                  id="originalHtml"
                  accept=".html"
                  onChange={(e) => handleFileUpload(e, "originalHtml")}
                  className="file-input"
                />
              </label>
              {originalHtml && (
                <p className="file-name">
                  <span className="file-icon">📄</span>
                  {originalHtml.name}
                </p>
              )}
            </div>

            <div className="upload-box">
              <label htmlFor="originalCss" className="upload-label">
                Upload CSS File
                <input
                  type="file"
                  id="originalCss"
                  accept=".css"
                  onChange={(e) => handleFileUpload(e, "originalCss")}
                  className="file-input"
                />
              </label>
              {originalCss && (
                <p className="file-name">
                  <span className="file-icon">📄</span>
                  {originalCss.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="project-area">
          <h2>Compare Project</h2>
          <div className="upload-group">
            <div className="upload-box">
              <label htmlFor="compareHtml" className="upload-label">
                Upload HTML File
                <input
                  type="file"
                  id="compareHtml"
                  accept=".html"
                  onChange={(e) => handleFileUpload(e, "compareHtml")}
                  className="file-input"
                />
              </label>
              {compareHtml && (
                <p className="file-name">
                  <span className="file-icon">📄</span>
                  {compareHtml.name}
                </p>
              )}
            </div>

            <div className="upload-box">
              <label htmlFor="compareCss" className="upload-label">
                Upload CSS File
                <input
                  type="file"
                  id="compareCss"
                  accept=".css"
                  onChange={(e) => handleFileUpload(e, "compareCss")}
                  className="file-input"
                />
              </label>
              {compareCss && (
                <p className="file-name">
                  <span className="file-icon">📄</span>
                  {compareCss.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="actions-container">
          <button
            className="deploy-button"
            onClick={handleDeploy}
            disabled={!compareHtml || !compareCss || isDeploying}
          >
            {isDeploying ? (
              <>
                <span className="spinner"></span>
                Deploying...
              </>
            ) : (
              <>
                <span className="icon">🚀</span>
                Deploy Projects
              </>
            )}
          </button>

          {uploadError && (
            <div className="upload-status error">{uploadError}</div>
          )}

          {deployedLinks && (
            <div className="deployed-links">
              <div className="link-card">
                <h3>Original Project URL</h3>
                <a
                  href={deployedLinks.original}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {deployedLinks.original}
                </a>
              </div>
              <div className="link-card">
                <h3>Compare Project URL</h3>
                <a
                  href={deployedLinks.compare}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {deployedLinks.compare}
                </a>
              </div>
            </div>
          )}

          <button
            className="compare-button"
            onClick={handleCompare}
            disabled={!deployedLinks || isComparing}
          >
            {isComparing ? (
              <>
                <span className="spinner"></span>
                Comparing...
              </>
            ) : (
              <>
                <span className="icon">⚖️</span>
                Compare Files
              </>
            )}
          </button>
        </div>
      </div>

      {results && (
        <div className="results-grid">
          <div className="result-card similarity-card">
            <h2>Similarity Analysis</h2>
            <div className="markdown-content">
              <div className="similarity-scores">
                <div className="score-item">
                  <span className="score-label">Visual Similarity</span>
                  <div className="score-value">
                    {results.similarity_percentages.visual_similarity.toFixed(
                      1
                    )}
                    %
                  </div>
                </div>
                <div className="score-item">
                  <span className="score-label">Code Similarity</span>
                  <div className="score-value">
                    {results.similarity_percentages.code_similarity.toFixed(1)}%
                  </div>
                </div>
                <div className="score-item final-score">
                  <span className="score-label">Final Score</span>
                  <div className="score-value">
                    {results.similarity_percentages.final_combined_similarity.toFixed(
                      1
                    )}
                    %
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="result-card analysis-card">
            <h2>Deep Analysis</h2>
            <div className="markdown-content">
              <div className="analysis-content">
                {results.deepseek_analysis && (
                  <ReactMarkdown>{results.deepseek_analysis}</ReactMarkdown>
                )}
              </div>
            </div>
          </div>

          <div className="result-card suggestions-card">
            <h2>Improvement Suggestions</h2>
            <div className="markdown-content">
              <div className="suggestions-content">
                {results.improvement_suggestions && (
                  <ReactMarkdown>
                    {results.improvement_suggestions}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileComparison;
