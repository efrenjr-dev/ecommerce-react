import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import json from "superjson";

export default function ForgotPassword() {
    const [isFilled, setIsFilled] = useState(false);
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (email !== "") {
            setIsFilled(true);
        } else {
            setIsFilled(false);
        }
    }, [email]);

    async function forgotPassword() {
        setIsFilled(false);
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
                        email: email,
                    }),
                }
            );

            if (loginResponse.status === 204) {
                setIsSubmitted(true);
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            console.log(err.toString());
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        forgotPassword();
    }

    return (
        <Container>
            <Row className="d-flex flex-column align-items-center">
                <Col xs md="6">
                    {isSubmitted ? (
                        <h5 className="mt-5 mb-3 text-center">
                            Please check your email.
                        </h5>
                    ) : (
                        <>
                            <h5 className="mt-5 mb-3 text-center">
                                Enter your email.
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
                                    {/* <Form.Label>Email address</Form.Label> */}
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Enter email address"
                                    />
                                </Form.Group>
                                <div className="text-center">
                                    <Button
                                        className="w-100"
                                        variant="dark"
                                        type="submit"
                                        disabled={!isFilled}
                                    >
                                        Reset password
                                    </Button>
                                </div>
                            </Form>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
}
