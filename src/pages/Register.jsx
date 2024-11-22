import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import toast from "react-hot-toast";
import json from "superjson";
import { schema, validateForm } from "../utils/validation";

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});

    async function registerUser() {
        const loadingToast = toast.loading("Registering new user details");
        try {
            const body = {
                email: formData.email,
                password: formData.password,
                name: formData.fullName,
            };
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/auth/register`,
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: json.stringify(body),
                }
            );
            const serializedData = await response.json();
            const data = json.deserialize(serializedData);
            if (data.user) {
                toast.success(data.message, {
                    id: loadingToast,
                });
                navigate("/login");
                toast("Please check your email to verify.");
            } else {
                toast.error(data.message, {
                    id: loadingToast,
                });
            }
        } catch (err) {
            toast.error(err.toString(), {
                id: loadingToast,
            });
        }
    }

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    function handleSubmit(e) {
        e.preventDefault();

        const validationErrors = validateForm(schema.register, formData);
        setErrors(validationErrors || {});
        if (validationErrors) return;

        registerUser();
    }

    return (
        <Container>
            <Row className="pb-5 mb-5 justify-content-center">
                <Col xs md="6">
                    <h5 className="mt-5 mb-4 text-center">
                        Enter details to create an account.
                    </h5>
                    <Form
                        onSubmit={(e) => {
                            handleSubmit(e);
                        }}
                    >
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter Full Name"
                                required
                                isInvalid={!!errors.fullName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.fullName}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter Email"
                                required
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        {/* <Form.Group className="mb-3">
                            <Form.Label>Mobile Number:</Form.Label>
                            <Form.Control
                                type="number"
                                value={mobileNo}
                                onChange={(e) => {
                                    setMobileNo(e.target.value);
                                }}
                                placeholder="Enter Mobile Number"
                                required
                            />
                        </Form.Group> */}
                        <Form.Group className="mb-3">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter Password"
                                required
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                            <Form.Text id="passwordHelpBlock" muted>
                                Your password must be 8-20 characters long.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password:</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm Password"
                                required
                                isInvalid={!!errors.confirmPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.confirmPassword}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button className="w-100" variant="dark" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
