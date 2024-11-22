import { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { toast } from "react-hot-toast";
import { getCookie } from "../utils/cookieService";
import json from "superjson";
import fetchWrapper from "../utils/fetchWrapper";
import { useLocation, useNavigate } from "react-router-dom";
import { schema, validateForm } from "../utils/validation";

export default function AddUser() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const location = useLocation();

    function resetForm() {
        setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "user",
        });
    }

    async function createUser() {
        const loadingToast = toast.loading("Creating new user");
        try {
            const userResponse = await fetchWrapper(
                `${import.meta.env.VITE_API_URL}/users/`,
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getCookie("accessToken")}`,
                    },
                    body: json.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        role: formData.role,
                    }),
                },
                navigate,
                location
            );
            if (userResponse.ok) {
                const serializedData = await userResponse.json();
                const userData = json.deserialize(serializedData);
                toast.success(`New user ${userData.email} has been created`, {
                    id: loadingToast,
                });
            } else {
                toast.error("Creating user has failed.", { id: loadingToast });
            }
        } catch (err) {
            toast.error(err.toString(), { id: loadingToast });
        }
    }

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    function handleSubmit(e) {
        e.preventDefault();
        const validationErrors = validateForm(schema.addUser, formData);
        setErrors(validationErrors || {});
        if (validationErrors) return;

        createUser();
        resetForm();
    }

    return (
        <Container>
            <Row className="justify-content-center">
                <Col xs md="6">
                    <h4 className="my-5 text-center">Create New User</h4>
                    <Form
                        onSubmit={(e) => {
                            handleSubmit(e);
                        }}
                    >
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter user's name"
                                required
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                required
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                required
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password:</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm password"
                                required
                                isInvalid={!!errors.confirmPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.confirmPassword}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Role:</Form.Label>
                            <Form.Select
                                aria-label="Select user role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                isInvalid={!!errors.role}
                            >
                                <option>Select user role</option>
                                <option value="user">User</option>
                                <option value="admin">Administrator</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.role}
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
