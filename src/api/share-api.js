import { axiosWithCreds, axiosWithoutCreds } from "./axiosInstances";

/**
 * Creates a secure share link for a file or folder.
 *
 * @param {object} shareData - Share link payload.
 * @returns {Promise<object>} Created share link data.
 */
export const createShare = async (shareData) => {
  const { data } = await axiosWithCreds.post("/shares", shareData);
  return data;
};

/**
 * Gets share links for a file or folder.
 *
 * @param {string} targetType - Shared item type.
 * @param {string} targetId - Shared item ID.
 * @returns {Promise<object>} Existing share links.
 */
export const getSharesForItem = async (targetType, targetId) => {
  const { data } = await axiosWithCreds.get(`/shares/${targetType}/${targetId}`);
  return data;
};

/**
 * Gets every share link created by the active user.
 *
 * @returns {Promise<object>} Share links created by the user.
 */
export const getMyShares = async () => {
  const { data } = await axiosWithCreds.get("/shares");
  return data;
};

/**
 * Revokes a share link owned by the active user.
 *
 * @param {string} shareId - Share link ID.
 * @returns {Promise<object>} Revoke response.
 */
export const revokeShare = async (shareId) => {
  const { data } = await axiosWithCreds.delete(`/shares/${shareId}`);
  return data;
};

/**
 * Fetches public share data by token.
 *
 * @param {string} token - Public share token.
 * @param {string} dirId - Optional directory ID inside a shared folder.
 * @returns {Promise<object>} Public share data.
 */
export const getPublicShare = async (token, dirId = "") => {
  const { data } = await axiosWithoutCreds.get(`/public-shares/${token}`, {
    params: dirId ? { dirId } : {},
  });
  return data;
};
