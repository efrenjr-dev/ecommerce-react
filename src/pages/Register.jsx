import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import toast from "react-hot-toast";
import json from "superjson";

export default function Register() {
    const navigate = useNavigate();

    // const [status, setStatus] = useState("typing"); // typing || submitting || success || error
    const [isFilled, setIsFilled] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    // const [mobileNo, setMobileNo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (
            fullName !== "" &&
            email !== "" &&
            // mobileNo !== "" &&
            password !== "" &&
            confirmPassword !== ""
        ) {
            setIsFilled(true);
        } else {
            setIsFilled(false);
        }
    }, [fullName, email, password, confirmPassword]);

    async function registerUser() {
        const loadingToast = toast.loading("Registering new user details");
        try {
            const body = {
                email: email,
                password: password,
                name: fullName,
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
            console.log(data);
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
            registerUser();
        }
    }

    return (
        <>
            <Row className="pb-5 mb-5 justify-content-center">
                <Form
                    onSubmit={(e) => {
                        handleSubmit(e);
                    }}
                >
                    <Col xs md="6">
                        <h5 className="mt-5 mb-4 text-center">
                            Enter details to create an account.
                        </h5>

                        <Form.Group className="mb-3">
                            <Form.Label>Full Name:</Form.Label>
                            <Form.Control
                                type="text"
                                value={fullName}
                                onChange={(e) => {
                                    setFullName(e.target.value);
                                }}
                                placeholder="Enter Full Name"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                placeholder="Enter Email"
                                required
                            />
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
                    </Col>
                    <Col xs md="6" className="text-center ">
                        <Button
                        className="w-100"
                            variant="dark"
                            type="submit"
                            disabled={!isFilled}
                        >
                            Submit
                        </Button>
                    </Col>
                </Form>
            </Row>
        </>
    );
}

// {
//     "email": "admin123@mail.com",
//     "password": "admin123",
//     "firstName": "Admin",
//     "lastName": "User",
//     "mobileNo": "09999999"
// }
