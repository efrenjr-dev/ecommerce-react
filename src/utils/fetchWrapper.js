import json from "superjson";
import { getCookie, removeCookie, setCookie } from "./cookieService";

const fetchWrapper = async (url, options = {}, navigate, location) => {
    const response = await fetch(url, { ...options, credentials: "include" });

    // console.log("Fetch Wrapper Response Status:", response.status);
    if (response.status === 401) {
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
        if (refreshResponse.ok) {
            removeCookie("refreshToken");
            setCookie("accessToken", data.tokens.access.token, {
                expires: data.tokens.access.expires,
            });
            setCookie("refreshToken", data.tokens.refresh.token, {
                expires: data.tokens.refresh.expires,
            });
            return fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${getCookie("accessToken")}`,
                },
            });
        } else {
            // const pathname = window.location.href.split("/")[3];
            const pathname = location.pathname.split("/")[1];
            if (
                pathname !== "reset-password" &&
                pathname !== "verify-email" &&
                pathname !== "products"
            ) {
                navigate("/");
            }
        }
    }
    return response;
};
export default fetchWrapper;
