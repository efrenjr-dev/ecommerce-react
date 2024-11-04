import { useState, useEffect } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/Form";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import json from "superjson";

export default function ResetPassword() {
    const { token } = useParams();
    const [isFilled, setIsFilled] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (
            password !== "" &&
            password.length >= 8 &&
            confirmPassword !== "" &&
            confirmPassword.length >= 8
        ) {
            setIsFilled(true);
        } else {
            setIsFilled(false);
        }
    }, [password, confirmPassword]);

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
                        password: password,
                    }),
                }
            );

            const serializedData = await loginResponse.json();
            const data = json.deserialize(serializedData);
            console.log(data);
            if (data.message === "Password has been reset.") {
                toast.success(
                    `Password has been reset. Please log in with new credentials`,
                    {
                        id: loadingToast,
                    }
                );
                navigate("/login");
            } else {
                toast.error(
                    "Reset password has failed. Please submit new reset password request.",
                    { id: loadingToast }
                );
            }
        } catch (err) {
            console.log(err);
            toast.error(err.toString(), { id: loadingToast });
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Password and Confirm Password fields do not match.", {
                id: "validator",
            });
        } else if (password.length < 8) {
            toast.error("Password should be at least 8 characters.", {
                id: "validator",
            });
        } else {
            resetPassword();
        }
    }

    return (
        <>
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
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                                placeholder="Enter Password"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password:</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                }}
                                placeholder="Confirm Password"
                                required
                            />
                        </Form.Group>
                        <Button
                            className="w-100"
                            variant="dark"
                            type="submit"
                            disabled={!isFilled}
                        >
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </>
    );
}
