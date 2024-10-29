import { useContext, useEffect } from "react";
import { toast } from "react-hot-toast";
import { UserContext } from "../userContext";
import { redirect } from "react-router-dom";

export default function Logout() {
    const { setUser, unsetUser } = useContext(UserContext);
    redirect("/");
    useEffect(() => {
        setUser({
            id: null,
            isAdmin: null,
        });
        unsetUser();
        toast.success("You have been logged out.");
    }, []);

    return <></>;
}
