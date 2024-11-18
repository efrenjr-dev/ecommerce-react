import { useState, useEffect } from "react";
import { UserContext } from "../userContext";
import Container from "react-bootstrap/Container";
import { Toaster } from "react-hot-toast";
import AppNavBar from "../components/AppNavBar";
import {
    Outlet,
    useLocation,
    useNavigate,
} from "react-router-dom";
import json from "superjson";
import { getCookie, removeCookie } from "../utils/cookieService";
import fetchWrapper from "../utils/fetchWrapper";

export default function Root() {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState({
        id: null,
        role: null,
    });

    const unsetUser = () => {
        removeCookie("accessToken");
        removeCookie("refreshToken");
        setUser({ id: null, role: null });
    };

    useEffect(() => {
        fetchWrapper(
            `${import.meta.env.VITE_API_URL}/users`,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    Authorization: `Bearer ${getCookie("accessToken")}`,
                },
            },
            navigate,
            location
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `No user credentials found. Status: ${response.status}`
                    );
                }
                return response.json();
            })
            .then((serializedData) => json.deserialize(serializedData))
            .then((data) => {
                setUser({
                    id: data.id,
                    role: data.role,
                });
            })
            .catch((err) => {
                console.log(err.toString());
            });
    }, []);

    return (
        <>
            <UserContext.Provider value={{ user, setUser, unsetUser }}>
                <Toaster
                    toastOptions={{
                        // duration: 7000,
                        position: "top-center",
                        reverseOrder: true,
                        style: {
                            borderRadius: "10px",
                            // background: "#333",
                            // color: "#fff",
                        },
                    }}
                />
                <AppNavBar />
                <Container className="mb-5">
                    <Outlet />
                </Container>
            </UserContext.Provider>
        </>
    );
}
