import { useState, useEffect } from "react";
import { UserContext } from "../userContext";
import Container from "react-bootstrap/Container";
import { Toaster, toast } from "react-hot-toast";
import AppNavBar from "../components/AppNavBar";
import { Outlet } from "react-router-dom";
import json from "superjson";

export default function Root() {
    const [user, setUser] = useState({
        id: null,
        role: null,
    });

    const unsetUser = () => {
        localStorage.removeItem("ecommercetoken");
    };

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/users`, {
            method: "GET",
            mode: "cors",
            headers: {
                // Authorization: `Bearer ${localStorage.getItem(
                //     "ecommercetoken"
                // )}`,
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNjU2N2E4Zi1jMmMwLTQxY2EtYTA0My1lYTQ5NTlmOTRkYmQiLCJpYXQiOjE3MzAwMDcxMTgsImV4cCI6MTczMDAxMDcxOCwidHlwZSI6ImFjY2VzcyJ9.s7uZl2WDKH2PhAvn4HAVeUYofMfW2eLGJd_fpuNGQjc`,
            },
        })
            .then((response) => response.json())
            .then((serializedData) => json.deserialize(serializedData))
            .then((data) => {
                console.log(data);
                setUser({
                    id: data.id,
                    role: data.role,
                    isActive: data.isActive,
                    isEmailVerified: data.isEmailVerified,
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
