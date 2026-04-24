import { axiosWithCreds } from "./axiosInstances";

/**
 * Deletes a file owned by the active user.
 *
 * @param {string} id - File ID to delete.
 * @returns {Promise<object>} Delete response.
 */
export const deleteFile = async (id) => {
  const { data } = await axiosWithCreds.delete(`/file/${id}`);
  return data;
};

/**
 * Renames a file owned by the active user.
 *
 * @param {string} id - File ID to rename.
 * @param {string} newFilename - New display name for the file.
 * @returns {Promise<object>} Rename response.
 */
export const renameFile = async (id, newFilename) => {
  const { data } = await axiosWithCreds.patch(`/file/${id}`, {
    newFilename,
  });
  return data;
};

/**
 * Starts a direct-to-S3 file upload and returns the signed upload details.
 *
 * @param {object} fileData - File metadata for upload initiation.
 * @returns {Promise<object>} Signed upload details from the backend.
 */
export const uploadInitiate = async (fileData) => {
  const { data } = await axiosWithCreds.post("/file/upload/initiate", fileData);
  return data;
};

/**
 * Marks an uploaded file as complete after S3 verification.
 *
 * @param {string} fileId - Uploaded file record ID.
 * @returns {Promise<object>} Completion response.
 */
export const uploadComplete = async (fileId) => {
  const { data } = await axiosWithCreds.post("/file/upload/complete", {
    fileId,
  });
  return data;
};

/**
 * Cancels a pending upload and removes its backend file record.
 *
 * @param {string} fileId - Pending file record ID.
 * @returns {Promise<object>} Cancellation response.
 */
export const uploadCancel = async (fileId) => {
  const { data } = await axiosWithCreds.delete(`/file/upload/${fileId}`);
  return data;
};
