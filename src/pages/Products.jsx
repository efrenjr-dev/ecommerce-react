import { useContext, useState } from "react";
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
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";
import { getCookie } from "../utils/cookieService";
import fetchWrapper from "../utils/fetchWrapper";
import ProductLoading from "../components/ProductLoading";

export default function Products({ take = 20, title = "All Products" }) {
    // const products = useLoaderData();
    const { user } = useContext(UserContext);
    const [searchString, setSearchString] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const fetchOrderData = async () => {
        const url =
            user.role === "admin"
                ? `${
                      import.meta.env.VITE_API_URL
                  }/products/all?searchString=${searchString}&skip=0&take=${take}`
                : `${
                      import.meta.env.VITE_API_URL
                  }/products/?searchString=${searchString}&skip=0&take=${take}`;

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
        queryKey: ["products", user.role, take],
        queryFn: fetchOrderData,
        enabled: !!user.role || user.role === null,
    });

    if (isError) return <span>Error: {error.message}</span>;

    if (isPending) return <ProductLoading />;

    if (data) {
        return (
            <>
                <Outlet />
                <h3 className="my-5 text-center">{title}</h3>
                {data.length > 1 ? (
                    <Row xs={1} sm={3} lg={4} className="">
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
                ) : (
                    <Row className="d-flex flex-column align-items-center">
                        <Col xs md="2"></Col>
                        <Col md="8">
                            <h5 className="text-center">No product found.</h5>
                        </Col>
                        <Col xs md="2"></Col>
                    </Row>
                )}
            </>
        );
    }
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
