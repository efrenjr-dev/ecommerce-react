import { useContext, useMemo, useState } from "react";
import {
    Outlet,
    useLoaderData,
    useLocation,
    useNavigate,
} from "react-router-dom";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Product from "../components/Product";
import { UserContext } from "../userContext";
import json from "superjson";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "../utils/cookieService";
import fetchWrapper from "../utils/fetchWrapper";
import ProductLoading from "../components/ProductLoading";
import { Button } from "react-bootstrap";
import { debounce } from "../utils/debounce";

export default function Products({ take = 20, title = "All Products" }) {
    // const products = useLoaderData();
    const { user } = useContext(UserContext);
    const queryClient = useQueryClient();
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
            .then((response) => response.json())
            .then((serializedData) => json.deserialize(serializedData))
            .catch((err) => {
                console.log(err);
            });
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
            <div
                className="text-center mb-3
            "
            >
                <input
                    type="text"
                    placeholder="Search items..."
                    value={searchInput}
                    onChange={handleSearchChange}
                />
            </div>

            {isLoading && <ProductLoading />}
            {isError && <p>Error: {error.message}</p>}

            {!isLoading &&
                data &&
                (data.productsCount > 0 ? (
                    <>
                        <Row xs={1} sm={3} lg={4} className="">
                            {data.products.map((product) => {
                                // console.log(product);
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
                                disabled={!data.hasMore} // Disable if there are no more items
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

// export async function loader() {
//     const response = await fetch(
//         `${
//             import.meta.env.VITE_API_URL
//         }/products/?searchString=&skip=0&take=10`,
//         {
//             method: "GET",
//             mode: "cors",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${localStorage.getItem(
//                     "ecommercetoken"
//                 )}`,
//             },
//         }
//     );
//     const serializedData = await response.json();
//     const data = await json.deserialize(serializedData);
//     return data;
// }
