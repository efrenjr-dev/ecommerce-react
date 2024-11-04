import json from "superjson";
import { getCookie } from "./cookieService";

const fetchWrapper = async (url, options = {}, navigate) => {
    const response = await fetch(url, { ...options, credentials: "include" });

    const body = { refreshToken: getCookie("refreshToken") };
    console.log("Fetch Wrapper Response Status:", response.status);
    if (response.status === 401) {
        console.log("Unauthorized: Refreshing Token");
        // Access token expired, try to refresh
        const refreshResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: json.stringify(body),
            }
        );

        if (refreshResponse.ok) {
            // Retry original request with new access token
            return fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${getCookie("accessToken")}`,
                },
                credentials: "include",
            });
        } else {
            console.log("Refresh token invalid. Redirect to home page");
            console.log("Pathname", window.location.href.split("/")[3]);
            if (window.location.href.split("/")[3] !== "reset-password")
                navigate("/"); // Redirect to home if refresh fails
        }
    }

    return response;
};

export default fetchWrapper;
