import json from "superjson";
import { getCookie } from "./cookieService";

const fetchWrapper = async (url, options = {}) => {
    const response = await fetch(url, { ...options, credentials: "include" });

    const body = { refreshToken: getCookie("refreshToken") };
    if (response.status === 401) {
        // Access token expired, try to refresh
        const refreshResponse = await fetch("/auth/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: json.stringify(body),
        });

        if (refreshResponse.ok) {
            // Retry original request with new access token
            return fetch(url, { ...options, credentials: "include" });
        } else {
            window.location.href = "/login"; // Redirect to login if refresh fails
        }
    }

    return response;
};

export default fetchWrapper;
