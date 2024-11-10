import { useState, useEffect, useContext } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/Form";
import { toast } from "react-hot-toast";
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

            if (loginResponse.status===204) {
                setIsSubmitted(true);
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
          // console.log(err);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        forgotPassword();
    }

    return (
        <>
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
        </>
    );
}

// {
//     "email": "goodgirl@mail.com",
//     "password": "goodgirl"
// }
