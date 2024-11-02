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

export default function Products() {
    // const products = useLoaderData();
    const { user } = useContext(UserContext);

    const { isPending, isError, data, error } = useQuery({
        queryKey: ["products"],
        queryFn: async () =>
            fetchWrapper(
                `${
                    import.meta.env.VITE_API_URL
                }/products/?searchString=&skip=0&take=50`,
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
                    <h3 className="my-5 text-center">Fashion</h3>
                    <Row xs={1} sm={2} lg={3} className="">
                        {/* {activeProducts} */}
                        {data.map((product) => {
                            // console.log(product);
                            return (
                                <Col className="mb-4" key={product.id}>
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
