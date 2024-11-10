import { useState, useEffect } from "react";
import { UserContext } from "../userContext";
import Container from "react-bootstrap/Container";
import { Toaster, toast } from "react-hot-toast";
import AppNavBar from "../components/AppNavBar";
import {
    Outlet,
    useLoaderData,
    useLocation,
    useNavigate,
} from "react-router-dom";
import json from "superjson";
import { getCookie, removeCookie } from "../utils/cookieService";
import fetchWrapper from "../utils/fetchWrapper";

export default function Root() {
    // const data = useLoaderData();
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
            .then((response) => response.json())
            .then((serializedData) => json.deserialize(serializedData))
            .then((data) => {
              // console.log("user role: ", data.role);
                setUser({
                    id: data.id,
                    role: data.role,
                });
            })
            .catch((err) => {
              // console.log(err.toString());
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

// export const loader = async ({ params }) => {
//     return fetchWrapper(
//         `${import.meta.env.VITE_API_URL}/users`,
//         {
//             method: "GET",
//             mode: "cors",
//             headers: {
//                 Authorization: `Bearer ${getCookie("accessToken")}`,
//             },
//         },
//     )
//         .then((response) => response.json())
//         .then((serializedData) => json.deserialize(serializedData))
//         .catch((err) => {
//             throw new Error(err);
//           // console.log(err.toString());
//             // toast.error(err.toString());
//         });
// };
