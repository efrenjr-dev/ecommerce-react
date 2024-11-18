import { useMemo, useState, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import json from "superjson";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "../utils/cookieService";
import fetchWrapper from "../utils/fetchWrapper";
import { debounce } from "../utils/debounce";
import { UserContext } from "../userContext";

export default function Users() {
    const { user } = useContext(UserContext);
    const [searchInput, setSearchInput] = useState("");
    const [searchString, setSearchString] = useState("");
    const [page, setPage] = useState(1);
    const take = 10;
    const skip = (page - 1) * take;
    const navigate = useNavigate();
    const location = useLocation();

    const fetchUsersData = async () => {
        const url = `${
            import.meta.env.VITE_API_URL
        }/users/all?searchString=${searchString}&skip=${skip}&take=${take}`;

        return await fetchWrapper(
            url,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    Authorization: `Bearer ${getCookie("accessToken")}`,
                },
            },
            navigate,
            location
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((serializedData) => json.deserialize(serializedData));
    };

    const { isLoading, isError, data, error } = useQuery({
        queryKey: ["users", user.role, searchString, take, page],
        queryFn: fetchUsersData,
        keepPreviousData: true,
        staleTime: 0,
        enabled: !!user,
    });

    const debouncedSetSearchString = useMemo(
        () =>
            debounce((value) => {
                setSearchString(value);
                setPage(1);
            }, 500),
        []
    );

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);
        debouncedSetSearchString(value);
    };

    const handleRowClick = (path) => {
        navigate(path);
    };

    return (
        <>
            <h3 className="mt-5 mb-4 text-center">Users</h3>
            <Row className="mb-3">
                <Col></Col>
                <Col xs={12} md={8} lg={4}>
                    <Form>
                        <Form.Control
                            className=""
                            type="text"
                            placeholder="Search items..."
                            value={searchInput}
                            onChange={handleSearchChange}
                        />
                    </Form>
                </Col>
                <Col></Col>
            </Row>
            {isLoading && (
                <div className="m-5 text-center">
                    <Spinner role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )}
            {isError && <p>Error: {error.message}</p>}

            {!isLoading &&
                data &&
                (data.users < 1 ? (
                    <Row className="d-flex flex-column align-items-center">
                        <Col xs md="2"></Col>
                        <Col md="8">
                            <h5 className="text-center">No user found.</h5>
                        </Col>
                        <Col xs md="2"></Col>
                    </Row>
                ) : (
                    <>
                        <Row className="d-flex flex-column align-items-center">
                            <Col></Col>
                            <Col xs lg="10">
                                <Table striped hover responsive="md">
                                    <thead>
                                        <tr>
                                            <th className="px-3">Email</th>
                                            <th className="px-3">Name</th>
                                            <th className="px-3">Role</th>
                                            <th className="px-3 text-center">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.users.map((userData) => {
                                            return (
                                                <tr
                                                    onClick={() =>
                                                        handleRowClick(
                                                            `/updateuser/${userData.id}`
                                                        )
                                                    }
                                                    key={userData.id}
                                                >
                                                    <td className="px-3">
                                                        {userData.email}
                                                    </td>
                                                    <td className="px-3">
                                                        {userData.name}
                                                    </td>
                                                    <td className="px-3">
                                                        {userData.role==="admin"?"Administrator":userData.role==="user"&&"User"}
                                                    </td>
                                                    <td className="text-center">
                                                        <Button
                                                            variant="outline-dark"
                                                            as={Link}
                                                            to={`/updateuser/${userData.id}`}
                                                            className="btn-sm"
                                                        >
                                                            Edit details
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </Col>
                            <Col></Col>
                        </Row>
                        <div className="text-center">
                            <Button
                                variant="dark"
                                className="btn-sm"
                                disabled={page === 1}
                                onClick={() =>
                                    setPage((prev) => Math.max(prev - 1, 1))
                                }
                            >
                                Previous
                            </Button>
                            <span className="mx-3">Page {page}</span>
                            <Button
                                variant="dark"
                                className="btn-sm"
                                disabled={!data.hasMore}
                                onClick={() => setPage((prev) => prev + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </>
                ))}
        </>
    );
}
