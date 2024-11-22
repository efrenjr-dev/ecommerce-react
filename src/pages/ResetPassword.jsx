import { useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import json from "superjson";
import { UserContext } from "../userContext";
import { schema, validateForm } from "../utils/validation";

export default function ResetPassword() {
    const { unsetUser } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const { token } = useParams();

    const navigate = useNavigate();

    const resetForm = () => {
        setFormData({
            password: "",
            confirmPassword: "",
        });
    };

    async function resetPassword() {
        const loadingToast = toast.loading("Resetting password");
        try {
            const loginResponse = await fetch(
                `${
                    import.meta.env.VITE_API_URL
                }/auth/reset-password?token=${token}`,
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: json.stringify({
                        password: formData.password,
                    }),
                }
            );

            const serializedData = await loginResponse.json();
            const data = json.deserialize(serializedData);
            if (data.message === "Password has been reset.") {
                toast.success(
                    `Password has been reset. Please log in with new credentials`,
                    {
                        id: loadingToast,
                    }
                );
                unsetUser();
                navigate("/login");
            } else {
                toast.error(
                    "Reset password has failed. Please try again with new request.",
                    { id: loadingToast }
                );
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
        setIsLoading(true);
        const validationErrors = validateForm(schema.resetPassword, formData);
        setErrors(validationErrors || {});

        if (validationErrors) {
            setIsLoading(false);
            return;
        }

        resetPassword();
        setIsLoading(false);
        resetForm();
    }

    return (
        <Container>
            <Row className="pb-5 mb-5 justify-content-center">
                <Col xs md="6">
                    <h5 className="mt-5 mb-4 text-center">
                        Enter new password.
                    </h5>
                    <Form
                        onSubmit={(e) => {
                            handleSubmit(e);
                        }}
                    >
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
                        <Button
                            className="w-100"
                            variant="dark"
                            type="submit"
                            disabled={isLoading}
                        >
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
