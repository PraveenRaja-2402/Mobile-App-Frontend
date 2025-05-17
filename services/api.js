import apiClient from "./apiClient";

// 🔹 Centralized API Request Handler
const apiRequest = async (method, url, data = null) => {
  try {
    if (!["get", "post", "put", "delete"].includes(method)) {
      throw new Error(`❌ Invalid API method: ${method}`);
    }

    const response = await apiClient[method](url, data);
    return {
      success: true,
      data: response.data,
    };

  } catch (error) {
    return handleApiError(error);
  }
};

// =============================
// ✅ Transport Report API
// =============================
export const getTransportReports = async () =>
  apiRequest("get", "/api/transportReports");

export const createTransportReport = async (reportData) =>
  apiRequest("post", "/api/transportReports", reportData);

export const updateTransportReport = async (reportId, updatedData) =>
  apiRequest("put", `/api/transportReports/${reportId}`, updatedData);

export const deleteTransportReport = async (reportId) =>
  apiRequest("delete", `/api/transportReports/${reportId}`);

// =============================
// ✅ Hostel Report API
// =============================
export const getHostelReports = async () =>
  apiRequest("get", "/api/hostel");

export const createHostelReport = async (reportData) =>
  apiRequest("post", "/api/hostel", reportData);

// =============================
// ✅ Company Report API
// =============================
export const getCompanyReports = async () =>
  apiRequest("get", "/api/company");

export const createCompanyReport = async (reportData) =>
  apiRequest("post", "/api/company", reportData);

// =============================
// ✅ Harassment Report API
// =============================
export const getHarassmentReports = async () =>
  apiRequest("get", "/api/harassment");

export const createHarassmentReport = async (reportData) =>
  apiRequest("post", "/api/harassment", reportData);

// =============================
// ✅ New APIs for Admin Dashboard & Employee Home Tickets
// =============================

// Get all reports (admin dashboard) with status & details from combined reports
export const getAllReportsAdmin = async () =>
  apiRequest("get", "/api/admin/reports");

// Get tickets with employee details for employee home page slider
export const getHomeTicketsEmployee = async () =>
  apiRequest("get", "/api/tickets/home");

// =============================
// 🔹 API Error Handler
// =============================
const handleApiError = (error) => {
  console.error("❌ API Error:", {
    message: error.message || "Unknown Error",
    url: error.config?.url || "No URL",
    method: error.config?.method || "No Method",
    response: error.response?.data || "No Response Data",
    status: error.response?.status || 500,
    networkError: !error.response ? "🚨 Network issue - API unreachable" : null,
  });

  return {
    success: false,
    status: error.response?.status || 500,
    error: error.response?.data?.error || "❌ Unexpected API Error",
  };
};
