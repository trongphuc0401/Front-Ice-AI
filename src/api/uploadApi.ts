import axios from "axios";

interface UploadResponse {
  cssUrl: string;
  htmlUrl: string;
}

const API_CONFIG = {
  original: {
    url: import.meta.env.VITE_ORIGINAL_API_URL,
    code: import.meta.env.VITE_ORIGINAL_API_CODE,
  },
  compare: {
    url: import.meta.env.VITE_COMPARE_API_URL,
    code: import.meta.env.VITE_COMPARE_API_CODE,
  },
};

const createFormData = (htmlFile: File, cssFile: File): FormData => {
  const formData = new FormData();
  formData.append("htmlFile", htmlFile);
  formData.append("cssFile", cssFile);
  return formData;
};

export const uploadFilesCompare = async (
  challengeId: string,
  solutionId: string,
  htmlFile: File,
  cssFile: File
): Promise<UploadResponse> => {
  const formData = createFormData(htmlFile, cssFile);
  const url = `${API_CONFIG.compare.url}?challengeId=${challengeId}&solutionId=${solutionId}&code=${API_CONFIG.compare.code}`;

  const response = await axios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const uploadFilesOriginal = async (
  challengeId: string,
  htmlFile: File,
  cssFile: File
): Promise<UploadResponse> => {
  const formData = createFormData(htmlFile, cssFile);
  const url = `${API_CONFIG.original.url}?challengeId=${challengeId}&code=${API_CONFIG.original.code}`;

  const response = await axios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
