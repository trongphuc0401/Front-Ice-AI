import React, { useState, ChangeEvent, FormEvent } from "react";
import "../styles/FileComparison.css";

interface CompareProjectUploadProps {
  onUploadSuccess: (htmlUrl: string) => void;
}

const CompareProjectUpload: React.FC<CompareProjectUploadProps> = ({
  onUploadSuccess,
}) => {
  const [htmlFile, setHtmlFile] = useState<File | null>(null);
  const [cssFile, setCssFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    type: "html" | "css"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === "html") {
        setHtmlFile(file);
      } else {
        setCssFile(file);
      }
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!htmlFile || !cssFile) {
      setError("Please select both HTML and CSS files");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("htmlFile", htmlFile);
    formData.append("cssFile", cssFile);

    try {
      const apiUrl = `${import.meta.env.VITE_UPLOAD_API_URL}?challengedId=${
        import.meta.env.VITE_CHALLENGE_ID
      }&solutionId=${import.meta.env.VITE_SOLUTION_ID}&code=${
        import.meta.env.VITE_API_CODE
      }`;

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setUploadedUrl(data.htmlUrl);
      onUploadSuccess(data.htmlUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during upload"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="project-area">
      <h2>Compare Project</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="file-input-group">
          <label className="file-input-label">HTML File</label>
          <div className="file-input-wrapper">
            <input
              type="file"
              accept=".html"
              onChange={(e) => handleFileChange(e, "html")}
              className="file-input"
              title="Select HTML file"
            />
          </div>
          {htmlFile && (
            <div className="file-name-display">Selected: {htmlFile.name}</div>
          )}
        </div>

        <div className="file-input-group">
          <label className="file-input-label">CSS File</label>
          <div className="file-input-wrapper">
            <input
              type="file"
              accept=".css"
              onChange={(e) => handleFileChange(e, "css")}
              className="file-input"
              title="Select CSS file"
            />
          </div>
          {cssFile && (
            <div className="file-name-display">Selected: {cssFile.name}</div>
          )}
        </div>

        <button
          type="submit"
          className="upload-button"
          disabled={uploading || !htmlFile || !cssFile}
        >
          {uploading ? "Uploading..." : "Upload Files"}
        </button>

        {error && <div className="upload-status error">{error}</div>}

        {uploadedUrl && (
          <div className="project-url">
            <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
              {uploadedUrl}
            </a>
          </div>
        )}
      </form>
    </div>
  );
};

export default CompareProjectUpload;
