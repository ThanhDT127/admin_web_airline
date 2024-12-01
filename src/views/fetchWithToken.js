export const fetchWithToken = async (url, options = {}) => {
    const token = localStorage.getItem("adminToken");

    const headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    const fetchOptions = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, fetchOptions);


        if (response.status === 200) {
            if (localStorage.getItem("sessionExpired") === "true") {
                localStorage.setItem("sessionExpired", "false");
            }

        } else if (response.status === 401) {
            if (!localStorage.getItem("sessionExpired")) {
                localStorage.setItem("sessionExpired", "true");

            }
            if (localStorage.getItem("sessionExpired")) {
                alert("Your session has expired. Please log in again.");
                localStorage.removeItem("adminToken");
                window.location.href = "/login";
            }
        }
        return response;

    } catch (error) {
        console.error("Error fetching.", error);
        throw error;
    }
};
