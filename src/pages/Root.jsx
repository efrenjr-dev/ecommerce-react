import { useState, useEffect } from "react";
import { UserContext } from "../userContext";
import Container from "react-bootstrap/Container";
import { Toaster, toast } from "react-hot-toast";
import AppNavBar from "../components/AppNavBar";
import { Outlet } from "react-router-dom";
import json from "superjson";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function Root() {
    const [user, setUser] = useState({
        id: null,
        role: null,
    });

    const unsetUser = () => {
        cookies.remove("accessToken");
        cookies.remove("refreshToken");
    };

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/users`, {
            method: "GET",
            mode: "cors",
            headers: {
                Authorization: `Bearer ${cookies.get("accessToken")}`,
            },
        })
            .then((response) => response.json())
            .then((serializedData) => json.deserialize(serializedData))
            .then((data) => {
                console.log(data);
                setUser({
                    id: data.id,
                    role: data.role,
                });
            })
            .catch((err) => {
                console.log(err.toString());
                toast.error(err.toString());
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
                    }}
                />
                <AppNavBar />
                <Container>
                    <Outlet />
                </Container>
            </UserContext.Provider>
        </>
    );
}
