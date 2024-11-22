import { useContext, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Product from "./Product";
import { UserContext } from "../userContext";
import json from "superjson";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "../utils/cookieService";
import fetchWrapper from "../utils/fetchWrapper";
import ProductLoading from "./ProductLoading";
import { debounce } from "../utils/debounce";
import { Container } from "react-bootstrap";

export default function ProductSection({
    take = 4,
    title = "Suggested Products",
}) {
    const { user } = useContext(UserContext);
    const skip = (Math.floor(Math.random() * 5) + 1) * take;
    const navigate = useNavigate();
    const location = useLocation();

    const fetchOrderData = async () => {
        const url =
            user.role === "admin"
                ? `${
                      import.meta.env.VITE_API_URL
                  }/products/all?searchString=&skip=${skip}&take=${take}`
                : `${
                      import.meta.env.VITE_API_URL
                  }/products/?searchString=&skip=${skip}&take=${take}`;

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
        queryKey: ["products", user?.role, take],
        queryFn: fetchOrderData,
        keepPreviousData: true,
        enabled: !!user,
        staleTime: 0,
    });

    return (
        <Container fluid className="mt-3">
            <Outlet />
            <h3 className="mt-5 mb-4 text-center">{title}</h3>
            {isLoading && <ProductLoading items={take} />}
            {isError && <p>Error: {error.message}</p>}
            {!isLoading &&
                data &&
                (data.productsCount > 0 ? (
                    <>
                        <Row xs={1} sm={3} lg={4} className="">
                            {data.products.map((product) => {
                                return (
                                    <Col
                                        className="mb-4 d-flex justify-content-center align-items-stretch"
                                        key={product.id}
                                    >
                                        <Product
                                            productProp={product}
                                            userRole={user.role}
                                            productURL={`/product/${product.id}`}
                                        />
                                    </Col>
                                );
                            })}
                        </Row>
                    </>
                ) : (
                    <Row className="d-flex flex-column align-items-center">
                        <Col xs md="2"></Col>
                        <Col md="8">
                            <h5 className="text-center">No product found.</h5>
                        </Col>
                        <Col xs md="2"></Col>
                    </Row>
                ))}
        </Container>
    );
}
