export const mockUploadAPI = async (
  formData: FormData
): Promise<{ htmlUrl: string; cssUrl: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate API response
  return {
    htmlUrl:
      "https://challengerfileupload.blob.core.windows.net/chal-20251029-002-sol-20250325-009/index.html",
    cssUrl:
      "https://challengerfileupload.blob.core.windows.net/chal-20251029-002-sol-20250325-009/styles.css",
  };
};
