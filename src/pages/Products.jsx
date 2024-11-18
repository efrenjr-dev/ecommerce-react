import { useContext, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Product from "../components/Product";
import { UserContext } from "../userContext";
import json from "superjson";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "../utils/cookieService";
import fetchWrapper from "../utils/fetchWrapper";
import ProductLoading from "../components/ProductLoading";
import { debounce } from "../utils/debounce";

export default function Products({
    take = 20,
    title = "All Products",
    productLoading = 8,
}) {
    const { user } = useContext(UserContext);
    const [searchInput, setSearchInput] = useState("");
    const [searchString, setSearchString] = useState("");
    const [page, setPage] = useState(1);
    const skip = (page - 1) * take;
    const navigate = useNavigate();
    const location = useLocation();

    const fetchOrderData = async () => {
        const url =
            user.role === "admin"
                ? `${
                      import.meta.env.VITE_API_URL
                  }/products/all?searchString=${searchString}&skip=${skip}&take=${take}`
                : `${
                      import.meta.env.VITE_API_URL
                  }/products/?searchString=${searchString}&skip=${skip}&take=${take}`;

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
        queryKey: ["products", user?.role, searchString, take, page],
        queryFn: fetchOrderData,
        keepPreviousData: true,
        enabled: !!user,
        staleTime: 0,
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

    return (
        <>
            <Outlet />
            <h3 className="mt-5 mb-4 text-center">{title}</h3>
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

            {isLoading && <ProductLoading items={productLoading} />}
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
                                        />
                                    </Col>
                                );
                            })}
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
                ) : (
                    <Row className="d-flex flex-column align-items-center">
                        <Col xs md="2"></Col>
                        <Col md="8">
                            <h5 className="text-center">No product found.</h5>
                        </Col>
                        <Col xs md="2"></Col>
                    </Row>
                ))}
        </>
    );
}
