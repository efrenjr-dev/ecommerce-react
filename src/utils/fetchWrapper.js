import json from "superjson";
import { getCookie, setCookie } from "./cookieService";
import { useContext } from "react";
import { UserContext } from "../userContext";

const fetchWrapper = async (url, options = {}, navigate, location) => {
    const response = await fetch(url, { ...options, credentials: "include" });

    // console.log("Fetch Wrapper Response Status:", response.status);
    if (response.status === 401) {
        // console.log("Unauthorized: Refreshing Token");
        // Access token expired, try to refresh
        const body = { refreshToken: getCookie("refreshToken") };
        // console.log("Refresh Token Cookie:", body);
        const refreshResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: json.stringify(body),
            }
        );

        const serializedData = await refreshResponse.json();
        const data = json.deserialize(serializedData);
        // console.log(data);
        if (refreshResponse.ok) {
            setCookie("accessToken", data.tokens.access.token, {
                expires: data.tokens.access.expires,
            });
            setCookie("refreshToken", data.tokens.refresh.token, {
                expires: data.tokens.refresh.expires,
            });
            // Retry original request with new access token
            return fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${getCookie("accessToken")}`,
                },
            });
        } else {
            // console.log("Refresh token invalid. Redirect to home page");
            // const pathname = window.location.href.split("/")[3];
            const pathname = location.pathname.split("/")[1];

            // console.log("Pathname", window.location.href.split("/")[3]);
            // console.log("Pathname", pathname);
            if (
                pathname !== "reset-password" &&
                pathname !== "verify-email" &&
                pathname !== "products"
            ) {
                navigate("/"); // Redirect to home if refresh fails
            }
        }
    }
    return response;
};
export default fetchWrapper;
