import React, { useState } from "react";
import "../styles/FileComparison.css";

interface DeployButtonProps {
  onDeploySuccess: (htmlUrl: string) => void;
}

const DeployButton: React.FC<DeployButtonProps> = ({ onDeploySuccess }) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeploy = async () => {
    setIsDeploying(true);
    setError(null);

    try {
      // Get the files from local storage
      const htmlContent = localStorage.getItem("htmlContent");
      const cssContent = localStorage.getItem("cssContent");

      if (!htmlContent || !cssContent) {
        throw new Error("No files to deploy");
      }

      // Create files from the content
      const htmlFile = new File([htmlContent], "index.html", {
        type: "text/html",
      });
      const cssFile = new File([cssContent], "styles.css", {
        type: "text/css",
      });

      const formData = new FormData();
      formData.append("htmlFile", htmlFile);
      formData.append("cssFile", cssFile);

      const apiUrl = `${process.env.REACT_APP_UPLOAD_API_URL}?challengedId=${process.env.REACT_APP_CHALLENGE_ID}&solutionId=${process.env.REACT_APP_SOLUTION_ID}&code=${process.env.REACT_APP_API_CODE}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Deploy failed");
      }

      const data = await response.json();
      onDeploySuccess(data.htmlUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during deployment"
      );
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="deploy-container">
      <button
        className="deploy-button"
        onClick={handleDeploy}
        disabled={isDeploying}
      >
        <span className="icon">🚀</span>
        {isDeploying ? "Deploying..." : "Deploy Projects"}
      </button>
      {error && <div className="upload-status error">{error}</div>}
    </div>
  );
};

export default DeployButton;
