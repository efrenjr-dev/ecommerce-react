import { useState, useEffect, useContext } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/Form";
import { toast } from "react-hot-toast";
import { UserContext } from "../userContext";
import { Link, useNavigate } from "react-router-dom";
import json from "superjson";
import fetchWrapper from "../utils/fetchWrapper";

export default function Login() {
    const { setUser } = useContext(UserContext);
    const [isFilled, setIsFilled] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (email !== "" && password !== "") {
            setIsFilled(true);
        } else {
            setIsFilled(false);
        }
    }, [email, password]);

    async function loginUser() {
        const loadingToast = toast.loading("Logging in");
        try {
            const loginResponse = await fetchWrapper(
                `${import.meta.env.VITE_API_URL}/auth/login`,
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: json.stringify({
                        email: email,
                        password: password,
                    }),
                }
            );
            const data = json.deserialize(await loginResponse.json());

            if (data.user) {
                console.log(data.user.id, data.user.role);
                setUser({
                    id: data.user.id,
                    role: data.user.role,
                });
                toast.success(`You have been logged in as ${email}`, {
                    id: loadingToast,
                });
                navigate("/");
            } else {
                toast.error(data.message, { id: loadingToast });
            }
        } catch (err) {
            console.log(err);
            toast.error(err.toString(), { id: loadingToast });
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        loginUser();
    }

    return (
        <>
            <Row className="d-flex flex-column align-items-center">
                <Col xs md="6">
                    <h5 className="mt-5 mb-3 text-center">
                        Enter your email and password to sign in.
                    </h5>
                    <Form
                        onSubmit={(e) => {
                            handleSubmit(e);
                        }}
                    >
                        <Form.Group
                            className="mb-3"
                            controlId="loginForm.controlEmail"
                        >
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email address"
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="loginForm.controlPassword"
                        >
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                            />
                        </Form.Group>
                        <div className="text-center">
                            <Button
                                variant="dark"
                                type="submit"
                                disabled={!isFilled}
                            >
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Col>
                <Col className="text-center my-3">
                    <Link to={"/register"}>
                        Do not have an account? Sign up
                    </Link>
                </Col>
            </Row>
        </>
    );
}

// {
//     "email": "goodgirl@mail.com",
//     "password": "goodgirl"
// }
