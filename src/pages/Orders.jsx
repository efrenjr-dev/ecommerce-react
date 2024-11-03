import { useContext, useEffect, useState } from "react";
import { Button, Col, Row, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { UserContext } from "../userContext";
import { getCookie } from "../utils/cookieService";
import { useQuery } from "@tanstack/react-query";
import fetchWrapper from "../utils/fetchWrapper";
import json from "superjson";

export default function Orders() {
    const { user } = useContext(UserContext);
    // const [orders, setOrders] = useState([]);

    const { isPending, isError, data, error } = useQuery({
        queryKey: ["orders"],
        queryFn: async () =>
            fetchWrapper(`${import.meta.env.VITE_API_URL}/orders`, {
                method: "GET",
                mode: "cors",
                headers: {
                    Authorization: `Bearer ${getCookie("accessToken")}`,
                },
            })
                .then((response) => response.json())
                .then((serializedData) => json.deserialize(serializedData)),
    });

    if (isPending) {
        return (
            <div className="text-center">
                <Spinner role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (isError) {
        return <span> ERROR! {error}</span>;
    }

    if (data) {
        console.log("order data: ", data);
        const orders = data.map((order) => {
            // console.log("order");
            let date = new Date(order.createdAt);
            let strDate =
                date.getMonth() +
                1 +
                "/" +
                date.getDate() +
                "/" +
                date.getFullYear() +
                " " +
                date.getHours() +
                ":" +
                date.getMinutes();
            return (
                <tr key={order.id}>
                    <td>{strDate}</td>
                    <td className="text-end px-3">{order.total}</td>
                    {/* <td>{order.orderStatus}</td> */}
                    <td className="text-center">
                        <Button
                            variant="dark"
                            as={Link}
                            to={`/order/${order.id}`}
                            className="btn-sm"
                        >
                            View Details
                        </Button>
                    </td>
                </tr>
            );
        });
        return (
            <>
                <Row className="d-flex flex-column align-items-center">
                    <Col xs md="2"></Col>
                    <Col>
                        <h3 className="text-center my-5">Orders</h3>
                    </Col>
                    <Col md="8">
                        {data.length < 1 ? (
                            <h5 className="text-center">
                                You do not have any orders.
                            </h5>
                        ) : (
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Date Ordered</th>
                                        <th className="text-end px-3">
                                            Total Amount
                                        </th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>{orders.length > 0 && orders}</tbody>
                            </Table>
                        )}
                    </Col>
                    <Col xs md="2"></Col>
                </Row>
            </>
        );
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
