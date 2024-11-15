import { useContext, useEffect, useMemo, useState } from "react";
import { Button, Col, Row, Spinner, Table } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../userContext";
import { getCookie } from "../utils/cookieService";
import { useQuery } from "@tanstack/react-query";
import fetchWrapper from "../utils/fetchWrapper";
import json from "superjson";
import { debounce } from "../utils/debounce";

export default function Orders({ take = 5, title = "Recent Orders" }) {
    const { user } = useContext(UserContext);
    // if (!user.role) return null;
    const [page, setPage] = useState(1);
    const skip = (page - 1) * take;
    const navigate = useNavigate();
    const location = useLocation();
    // const [orders, setOrders] = useState([]);
    // console.log("User Role: ", user.role);

    const fetchOrderData = async () => {
        const url =
            user.role === "admin"
                ? `${
                      import.meta.env.VITE_API_URL
                  }/orders/all?skip=${skip}&take=${take}`
                : `${
                      import.meta.env.VITE_API_URL
                  }/orders/?skip=${skip}&take=${take}`;

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
            .then((response) => response.json())
            .then((serializedData) => json.deserialize(serializedData))
            .catch((err) => {
                console.log(err);
            });
    };

    const { isLoading, isError, data, error } = useQuery({
        queryKey: ["orders", user?.role, take, page],
        queryFn: fetchOrderData,
        keepPreviousData: true,
        enabled: !!user,
        staleTime: 0,
    });

    return (
        <>
            <h3 className="mt-5 mb-4 text-center">{title}</h3>
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
                (data.ordersCount < 1 ? (
                    <Row className="d-flex flex-column align-items-center">
                        <Col xs md="2"></Col>
                        <Col md="8">
                            <h5 className="text-center">
                                You do not have any orders.
                            </h5>
                        </Col>
                        <Col xs md="2"></Col>
                    </Row>
                ) : (
                    <>
                        <Row className="d-flex flex-column align-items-center">
                            <Col xs md="2"></Col>
                            <Col md="8">
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th>Order Date</th>
                                            <th className="text-end px-3">
                                                Total Amount
                                            </th>
                                            <th className="text-center text-secondary">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.orders.map((order) => {
                                            let date = new Date(
                                                order.createdAt
                                            );
                                            let strDate = date.toLocaleString(
                                                "en-US",
                                                {
                                                    weekday: "short", // For day of the week (e.g., "Monday")
                                                    year: "numeric", // For year (e.g., "2024")
                                                    month: "short", // For full month name (e.g., "November")
                                                    day: "numeric", // For the day of the month (e.g., "15")
                                                    hour: "2-digit", // For hour (e.g., "3")
                                                    minute: "2-digit", // For minute (e.g., "45")
                                                    second: "2-digit", // For seconds (e.g., "00")
                                                    hour12: true, // Use 12-hour format with AM/PM
                                                }
                                            );
                                            return (
                                                <tr key={order.id}>
                                                    <td>{strDate}</td>
                                                    <td className="text-end px-3">
                                                        {order.total}
                                                    </td>
                                                    {/* <td>{order.orderStatus}</td> */}
                                                    <td className="text-center">
                                                        <Button
                                                            variant="outline-secondary"
                                                            as={Link}
                                                            to={`/order/${order.id}`}
                                                            className="btn-sm"
                                                        >
                                                            View details
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </Col>
                            <Col xs md="2"></Col>
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
                                disabled={!data.hasMore} // Disable if there are no more items
                                onClick={() => setPage((prev) => prev + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </>
                ))}
        </>
    );

    if (isError) {
        return <span>Error: {error.message}</span>;
    }

    if (isLoading) {
        return (
            <div className="m-5 text-center">
                <Spinner role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (!isLoading && data) {
        if (data.length < 1) {
            return (
                <Row className="d-flex flex-column align-items-center">
                    <Col xs md="2"></Col>
                    <Col>
                        <h3 className="text-center my-5">{title}</h3>
                    </Col>
                    <Col md="8">
                        <h5 className="text-center">
                            You do not have any orders.
                        </h5>
                    </Col>
                    <Col xs md="2"></Col>
                </Row>
            );
        } else {
            return (
                <Row className="d-flex flex-column align-items-center">
                    <Col xs md="2"></Col>
                    <Col>
                        <h3 className="text-center my-5">{title}</h3>
                    </Col>
                    <Col md="8">
                        <Table striped hover>
                            <thead>
                                <tr>
                                    <th>Order Date</th>
                                    <th className="text-end px-3">
                                        Total Amount
                                    </th>
                                    <th className="text-center text-secondary">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((order) => {
                                    let date = new Date(order.createdAt);
                                    let strDate = date.toLocaleString();
                                    return (
                                        <tr key={order.id}>
                                            <td>{strDate}</td>
                                            <td className="text-end px-3">
                                                {order.total}
                                            </td>
                                            {/* <td>{order.orderStatus}</td> */}
                                            <td className="text-center">
                                                <Button
                                                    variant="outline-secondary"
                                                    as={Link}
                                                    to={`/order/${order.id}`}
                                                    className="btn-sm"
                                                >
                                                    View details
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </Col>
                    <Col xs md="2"></Col>
                </Row>
            );
        }
    }
}

// export const loader = async () => {
//     return fetch(`${import.meta.env.VITE_API_URL}/orders`, {
//         method: "GET",
//         mode: "cors",
//         credentials: "same-origin",
//         headers: {
//             Authorization: `Bearer ${getCookie("accessToken")}`,
//         },
//     });
// };
