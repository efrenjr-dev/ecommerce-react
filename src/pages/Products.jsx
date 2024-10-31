import { useContext } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Product from "../components/Product";
import { UserContext } from "../userContext";
import json from "superjson";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "react-bootstrap";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function Products() {
    // const products = useLoaderData();
    const { user } = useContext(UserContext);

    const { isPending, isError, data, error } = useQuery({
        queryKey: ["products"],
        queryFn: async () =>
            fetch(
                `${
                    import.meta.env.VITE_API_URL
                }/products/?searchString=&skip=0&take=50`,
                {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cookies.get("accessToken")}`,
                    },
                }
            )
                .then((response) => response.json())
                .then((serializedData) => json.deserialize(serializedData)),
    });

    return (
        <>
            {isPending ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : isError ? (
                <span>Error: {error.message}</span>
            ) : (
                <>
                    <Outlet />
                    <h3 className="my-5 text-center">Fashion</h3>
                    <Row xs={1} sm={2} lg={3}>
                        {/* {activeProducts} */}
                        {data.map((product) => {
                            // console.log(product);
                            return (
                                <Col
                                    className="d-flex justify-content-center align-items-stretch"
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
