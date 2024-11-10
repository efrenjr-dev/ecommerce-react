import { useContext } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Product from "../components/Product";
import { UserContext } from "../userContext";
import json from "superjson";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";
import { getCookie } from "../utils/cookieService";
import fetchWrapper from "../utils/fetchWrapper";
import ProductLoading from "../components/ProductLoading";

export default function Products({
    take=20,
    title = "All Products",
    adminRoute = "all",
}) {
    // const products = useLoaderData();
    const { user } = useContext(UserContext);
  // console.log("User Role: ", user.role);
    if (user.role === "admin") {
        const { isPending, isError, data, error } = useQuery({
            queryKey: ["products"],
            queryFn: async () =>
                fetchWrapper(
                    `${
                        import.meta.env.VITE_API_URL
                    }/products/${adminRoute}?searchString=&skip=0&take=${take}`,
                    {
                        method: "GET",
                        mode: "cors",
                        headers: {
                            Authorization: `Bearer ${getCookie("accessToken")}`,
                        },
                    }
                )
                    .then((response) => response.json())
                    .then((serializedData) => json.deserialize(serializedData)),
        });

        return (
            <>
                {isError ? (
                    <span>Error: {error.message}</span>
                ) : isPending ? (
                    <ProductLoading />
                ) : (
                    <>
                        <Outlet />
                        <h3 className="my-5 text-center">{title}</h3>
                        <Row xs={1} sm={3} lg={4} className="">
                            {/* {activeProducts} */}
                            {data.map((product) => {
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
                    </>
                )}
            </>
        );
    }
    if (user.role === "user" || user.role == null) {
        const { isPending, isError, data, error } = useQuery({
            queryKey: ["products"],
            queryFn: async () =>
                fetch(
                    `${
                        import.meta.env.VITE_API_URL
                    }/products/?searchString=&skip=0&take=${take}`,
                    {
                        method: "GET",
                        mode: "cors",
                        headers: {
                            Authorization: `Bearer ${getCookie("accessToken")}`,
                        },
                    }
                )
                    .then((response) => response.json())
                    .then((serializedData) => json.deserialize(serializedData)),
        });

        return (
            <>
                {isError ? (
                    <span>Error: {error.message}</span>
                ) : isPending ? (
                    <ProductLoading />
                ) : (
                    <>
                        <Outlet />
                        <h3 className="my-5 text-center">{title}</h3>
                        <Row xs={1} sm={2} lg={4} className="">
                            {/* {activeProducts} */}
                            {data.map((product) => {
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
                    </>
                )}
            </>
        );
    }
    return null;
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
