import { useState, useEffect, useContext } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/Form";
import { toast } from "react-hot-toast";
import { UserContext } from "../userContext";
import { Link, useNavigate } from "react-router-dom";
import json from "superjson";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { setCookie } from "../utils/cookieService";
import { loginSchema, validateForm } from "../utils/validation";

export default function Login() {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [isFilled, setIsFilled] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (
            formData.email !== "" &&
            formData.password !== "" &&
            formData.password.length >= 8
        ) {
            setIsFilled(true);
        } else {
            setIsFilled(false);
        }
    }, [formData]);

    async function loginUser() {
        const loadingToast = toast.loading("Logging in");
        try {
            const loginResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/auth/login`,
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: json.stringify({
                        email: formData.email,
                        password: formData.password,
                    }),
                }
            );
            const data = json.deserialize(await loginResponse.json());
            // console.log(Object.entries(data));
            if (loginResponse.ok) {
                // console.log(data.user.role);
                setUser({
                    id: data.user.id,
                    role: data.user.role,
                });
                setCookie("accessToken", data.tokens.access.token, {
                    expires: data.tokens.access.expires,
                });
                setCookie("refreshToken", data.tokens.refresh.token, {
                    expires: data.tokens.refresh.expires,
                });
                toast.success(`You have been logged in as ${formData.email}`, {
                    id: loadingToast,
                });
                navigate("/");
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            // console.log(err);
            toast.error(err.toString(), { id: loadingToast });
        }
    }

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    function handleSubmit(e) {
        e.preventDefault();
        const validationErrors = validateForm(loginSchema, formData);
        setErrors(validationErrors || {});
        if (validationErrors) return;
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
                                value={formData.email}
                                name="email"
                                onChange={handleChange}
                                placeholder="Enter email address"
                                isInvalid={!!errors.d}
                            />

                            <Form.Control.Feedback type="invalid">
                                {errors.username}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="loginForm.controlPassword"
                        >
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="text-center">
                            <Button
                                className="w-100"
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
                    <Link to={"/register"} className="me-4">
                        Sign up
                    </Link>
                    <Link to={"/forgot-password"}>Forgot password</Link>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col xs md="6" className="mt-5">
                    <Tabs
                        defaultActiveKey="admin"
                        id="user-credentials"
                        className="mb-3"
                    >
                        <Tab eventKey="admin" title="Admin User">
                            <h5>Admin Credentials</h5>
                            <p>
                                Email: admin@example.com
                                <br />
                                Password: admin123
                            </p>
                        </Tab>
                        <Tab eventKey="nonadmin" title="Non-Admin User">
                            <h5>Non-Admin Credentials</h5>
                            <p>
                                Email: nonadmin@example.com
                                <br />
                                Password: nonadmin123
                            </p>
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </>
    );
}

// {
//     "email": "goodgirl@mail.com",
//     "password": "goodgirl"
// }
