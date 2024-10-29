import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import toast from "react-hot-toast";

export default function Register() {
    const navigate = useNavigate();

    // const [status, setStatus] = useState("typing"); // typing || submitting || success || error
    const [isFilled, setIsFilled] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (
            firstName !== "" &&
            lastName !== "" &&
            email !== "" &&
            mobileNo !== "" &&
            password !== "" &&
            confirmPassword !== ""
        ) {
            setIsFilled(true);
        } else {
            setIsFilled(false);
        }
    }, [firstName, lastName, email, mobileNo, password, confirmPassword]);

    async function registerUser() {
        const loadingToast = toast.loading("Registering new user details");
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/users/register`,
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                        firstName: firstName,
                        lastName: lastName,
                        mobileNo: mobileNo,
                    }),
                }
            );
            const data = await response.json();
            console.log(data);
            if (data.status) {
                toast.success(data.message, {
                    id: loadingToast,
                });
                navigate("/login");
                toast("Please log in with user credentials");
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
            <Row className="justify-content-center">
                <Col xs md="6">
                    <h1 className="my-5 text-center">Registration</h1>
                    <Form
                        onSubmit={(e) => {
                            handleSubmit(e);
                        }}
                    >
                        <Form.Group className="mb-3">
                            <Form.Label>First Name:</Form.Label>
                            <Form.Control
                                type="text"
                                value={firstName}
                                onChange={(e) => {
                                    setFirstName(e.target.value);
                                }}
                                placeholder="Enter First Name"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name:</Form.Label>
                            <Form.Control
                                type="text"
                                value={lastName}
                                onChange={(e) => {
                                    setLastName(e.target.value);
                                }}
                                placeholder="Enter Last Name"
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
                        <Form.Group className="mb-3">
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
                        </Form.Group>
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
                        <Button type="submit" disabled={!isFilled}>
                            Submit
                        </Button>
                    </Form>
                </Col>
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
