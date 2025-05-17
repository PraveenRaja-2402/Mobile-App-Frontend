export const getCompanyReports = async () => {
    try {
        const response = await apiClient.get("/api/companyReports");

        // 🔥 Ensure response is valid before returning data
        if (!response || !response.data) {
            console.error("❌ No data received from /api/company.");
            return { success: false, data: [] };
        }

        return { success: true, data: response.data };

    } catch (error) {
        console.error("❌ API Error fetching company reports:", {
            message: error.message,
            status: error.response?.status || "No Status",
            data: error.response?.data || "No Response Data",
        });

        // 🔹 Handle authentication-specific errors separately
        if (error.response?.status === 401) {
            return { success: false, error: "Unauthorized access - Please log in." };
        }

        return { success: false, error: "❌ Unexpected API Error", data: [] };
    }
};
