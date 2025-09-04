// src/api/eoaApi.js
import axios from "axios";
import { getAuthToken } from "../../utility/auth";

const apiClient = axios.create({
  baseURL: "/api/", // proxy target must be defined in Vite/CRA config
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

/** Fetch all EOAs */
export const getEOAs = async () => {
  try {
    const response = await apiClient.get("web/eoa_loa");
    return response.data;
  } catch (error) {
    console.error("Error fetching EOAs:", error);
    throw error;
  }
};

/** Create a new EOA */
export const createEOA = async (data) => {
  try {
    const response = await apiClient.post("admin/eoa_loa", data);
    return response.data;
  } catch (error) {
    console.error("Error creating EOA:", error);
    throw error;
  }
};

/** Update an existing EOA */
export const updateEOA = async (data) => {
  try {
    const response = await apiClient.put("admin/eoa_loa", data);
    return response.data;
  } catch (error) {
    console.error("Error updating EOA:", error);
    throw error;
  }
};

/** Delete EOA by ID */
export const deleteEOA = async (id) => {
  try {
    const response = await apiClient.delete("admin/eoa_loa", { data: { id } });
    return response.data;
  } catch (error) {
    console.error("Error deleting EOA:", error);
    throw error;
  }
};

/** Upload a file (e.g., PDF/image) via presigned URL mechanism */
export const uploadFile = async (fileData) => {
  try {
    const response = await apiClient.post("presign/upload", fileData);
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
