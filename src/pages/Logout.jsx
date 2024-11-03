import { useContext, useEffect } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { toast } from "react-hot-toast";
import { UserContext } from "../userContext";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/cookieService";

export default function Logout() {
    const { setUser, unsetUser } = useContext(UserContext);
    const navigate = useNavigate();
    setUser({
        id: null,
        isAdmin: null,
    });
    useEffect(() => {
        toast.success("You have been logged out.");

        fetch(
            `${import.meta.env.VITE_API_URL}/auth/logout?token=${getCookie(
                "refreshToken"
            )}`,
            {
                method: "POST",
                mode: "cors",
            }
        ).then((res) => {
            unsetUser();
        });

        navigate("/");
    }, []);

    return null;
}
