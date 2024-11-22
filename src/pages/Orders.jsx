import { useContext, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../userContext";
import { getCookie } from "../utils/cookieService";
import { useQuery } from "@tanstack/react-query";
import fetchWrapper from "../utils/fetchWrapper";
import json from "superjson";
import formatPrice from "../utils/formatPrice";
import TableLoading from "../components/TableLoading";

export default function Orders({ take = 5, title = "Recent Orders" }) {
    const { user } = useContext(UserContext);
    const [page, setPage] = useState(1);
    const skip = (page - 1) * take;
    const navigate = useNavigate();
    const location = useLocation();

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
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((serializedData) => json.deserialize(serializedData));
    };

    const { isLoading, isError, data, error } = useQuery({
        queryKey: ["orders", user?.role, take, page],
        queryFn: fetchOrderData,
        keepPreviousData: true,
        enabled: !!user,
        staleTime: 0,
    });

    const handleRowClick = (path) => {
        navigate(path);
    };

    return (
        <main>
            <h3 className="mt-5 mb-4 text-center">{title}</h3>
            {isLoading && (
                <>
                    <TableLoading />
                </>
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
                            <Col></Col>
                            <Col xs lg="10">
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th>Order Date</th>
                                            {user.role === "admin" && (
                                                <th className="px-3">
                                                    Customer Name
                                                </th>
                                            )}
                                            <th className="text-end px-3">
                                                Total Amount
                                            </th>
                                            <th className="text-center">
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
                                                    weekday: "short",
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                    hour12: true,
                                                }
                                            );
                                            return (
                                                <tr
                                                    onClick={() =>
                                                        handleRowClick(
                                                            `/order/${order.id}`
                                                        )
                                                    }
                                                    key={order.id}
                                                >
                                                    <td>{strDate}</td>
                                                    {user.role === "admin" && (
                                                        <td className="px-3">
                                                            {order.User?.name}
                                                        </td>
                                                    )}
                                                    <td className="text-end px-3">
                                                        {formatPrice(
                                                            order.total
                                                        )}
                                                    </td>
                                                    {/* <td>{order.orderStatus}</td> */}
                                                    <td className="text-center">
                                                        <Button
                                                            variant="outline-dark"
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
        </main>
    );
}
