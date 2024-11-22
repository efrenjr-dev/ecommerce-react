import { Container } from "react-bootstrap";
import { Link, useLoaderData, useParams } from "react-router-dom";
import json from "superjson";

export default function VerifyEmail() {
    const result = useLoaderData();
    if (result.message === "Email has been verified.") {
        return (
            <Container>
                <h5 className="mt-5 text-center">
                    User email has been verified.
                </h5>
                <p className="text-center">
                    Please proceed to <Link to="/login">log in.</Link>
                </p>
            </Container>
        );
    } else {
        return (
            <Container>
                <h5 className="mt-5 text-center">Unable to verify.</h5>
                <p className="text-center">
                    Please <Link to="/login">log in</Link> to resend
                    verification email.
                </p>
            </Container>
        );
    }
}

export const loader = async ({ params }) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/verify-email?token=${
            params.token
        }`,
        {
            method: "POST",
            mode: "cors",
        }
    );
    const serializedData = await response.json();
    const data = await json.deserialize(serializedData);
    return data;
};
