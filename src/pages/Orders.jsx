import { useContext, useEffect, useState } from "react";
import { Button, Col, Row, Spinner, Table } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../userContext";
import { getCookie } from "../utils/cookieService";
import { useQuery } from "@tanstack/react-query";
import fetchWrapper from "../utils/fetchWrapper";
import json from "superjson";

export default function Orders({ take = 5, title = "Recent Orders" }) {
    const { user } = useContext(UserContext);
    // if (!user.role) return null;
    const navigate = useNavigate();
    const location = useLocation();
    // const [orders, setOrders] = useState([]);
    // console.log("User Role: ", user.role);

    const fetchOrderData = async () => {
        const url =
            user.role === "admin"
                ? `${
                      import.meta.env.VITE_API_URL
                  }/orders/all?skip=0&take=${take}`
                : `${import.meta.env.VITE_API_URL}/orders/?skip=0&take=${take}`;

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

    const { isPending, isError, data, error } = useQuery({
        queryKey: ["orders", user.role, take],
        queryFn: fetchOrderData,
        enabled: !!user.role,
    });

    if (isError) {
        return <span>Error: {error.message}</span>;
    }

    if (isPending) {
        return (
            <div className="m-5 text-center">
                <Spinner role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (data) {
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
