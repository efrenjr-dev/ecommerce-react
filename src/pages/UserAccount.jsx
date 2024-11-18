import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { getCookie } from "../utils/cookieService";
import json from "superjson";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useContext, useState } from "react";
import { UserContext } from "../userContext";
import { schema, validateForm } from "../utils/validation";
import toast from "react-hot-toast";
import fetchWrapper from "../utils/fetchWrapper";

export default function UserAccount() {
    const { user } = useContext(UserContext);
    const userData = useLoaderData();
    const [formData, setFormData] = useState({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        isActive: userData.isActive,
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    async function updateProduct() {
        setIsLoading(true);
        const loadingToast = toast.loading("Account Settings");
        try {
            const response = await fetchWrapper(
                `${import.meta.env.VITE_API_URL}/users/${userData.id}`,
                {
                    method: "PATCH",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getCookie("accessToken")}`,
                    },
                    body: json.stringify({
                        name: formData.name,
                    }),
                },
                navigate,
                location
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "An error occurred");
            }

            const serializedData = await response.json();
            const data = json.deserialize(serializedData);
            if (data.id) {
                toast.success("User has been updated successfully.", {
                    id: loadingToast,
                });
                userData.name = data.name;
                userData.email = data.email;
                userData.role = data.role;
                userData.isActive = data.isActive;
            }
        } catch (err) {
            toast.error(err.toString(), {
                id: loadingToast,
            });
        }
        setIsLoading(false);
    }

    async function forgotPassword() {
        setIsLoading(true);
        try {
            const loginResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: json.stringify({
                        email: userData.email,
                    }),
                }
            );

            if (loginResponse.status === 204) {
                toast.success(
                    "Please check your email to reset your password."
                );
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            console.log(err.toString());
        }
        setIsLoading(false);
    }

    const handleReset = () => {
        setFormData({
            name: userData.name,
            email: userData.email,
            role: userData.role,
            isActive: userData.isActive,
        });
    };

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    function handlePassword(e) {
        e.preventDefault();
        forgotPassword();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm(schema.updateUser, formData);
        setErrors(validationErrors || {});
        if (validationErrors) return;
        updateProduct();
    };
    const handleCancel = () => {
        setIsLoading(true);
        if (user.role === "admin") {
            navigate(`/users`);
        } else {
            navigate("/");
        }
    };

    return (
        <>
            <Row className="justify-content-center">
                <Col xs md="6">
                    <h4 className="my-5 text-center">My Account</h4>
                    <Form
                        onSubmit={(e) => {
                            handleSubmit(e);
                        }}
                    >
                        <Form.Group className="mb-3">
                            <Form.Label>User ID:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={userData.id}
                                required
                                disabled
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder=""
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
                                disabled
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        {user.role === "admin" && (
                            <Form.Group className="mb-3">
                                <Form.Label>Role:</Form.Label>
                                <Form.Select
                                    aria-label="Select user role"
                                    name="role"
                                    value={formData.role}
                                    placeholder={userData.role}
                                    onChange={handleChange}
                                    isInvalid={!!errors.role}
                                    disabled
                                >
                                    <option>Select user role</option>
                                    <option value="user">User</option>
                                    <option value="admin">Administrator</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors.role}
                                </Form.Control.Feedback>
                            </Form.Group>
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label>Email Verified:</Form.Label>
                            <Form.Control
                                type="text"
                                name="isEmailVerified"
                                placeholder={
                                    userData.isEmailVerified
                                        ? "Verified"
                                        : "Not Verified"
                                }
                                disabled
                            />
                        </Form.Group>
                        {user.role === "admin" && (
                            <Form.Group className="mb-3">
                                <Form.Label>Active:</Form.Label>
                                <Form.Check
                                    type="switch"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    disabled
                                />
                            </Form.Group>
                        )}
                        <div className="d-flex">
                            <Button
                                variant="outline-danger"
                                className=""
                                onClick={handlePassword}
                                disabled={isLoading}
                            >
                                Reset Password
                            </Button>
                            <Button
                                variant="dark"
                                className="ms-auto mx-1"
                                disabled={isLoading}
                                onClick={handleReset}
                            >
                                Reset Form
                            </Button>
                            <Button
                                variant="danger"
                                className=""
                                type="submit"
                                disabled={isLoading}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </>
    );
}

export const loader = () => {
    return fetch(`${import.meta.env.VITE_API_URL}/users/`, {
        method: "GET",
        mode: "cors",
        headers: {
            Authorization: `Bearer ${getCookie("accessToken")}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((serializedData) => json.deserialize(serializedData))
        .catch((error) => error);
};
