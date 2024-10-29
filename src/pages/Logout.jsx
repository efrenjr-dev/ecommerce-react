import { useContext, useEffect } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { toast } from "react-hot-toast";
import { UserContext } from "../userContext";
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const { setUser, unsetUser } = useContext(UserContext);
    const navigate = useNavigate();
    toast.success("You have been logged out.");
    unsetUser();

    useEffect(() => {
        setUser({
            id: null,
            isAdmin: null,
        });
        navigate("/");
    }, []);

    return (
        <>
            <Row className="justify-content-center">
                <Col xs md="6">
                    <h1 className="my-5 text-center"></h1>
                </Col>
            </Row>
        </>
    );
}
