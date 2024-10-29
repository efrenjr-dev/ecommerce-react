import { useContext, useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Product from "../components/Product";
import { Spinner } from "react-bootstrap";
import { UserContext } from "../userContext";
import json from "superjson";

export default function Products() {
    const products = useLoaderData();
    const { user } = useContext(UserContext);
    // const [isLoading, setIsLoading] = useState(true);
    const [activeProducts, setActiveProducts] = useState([]);

    // useEffect(() => {
    //     if (!user.isAdmin) {
    //         setIsLoading(true);
    //         fetch(
    //             `${
    //                 import.meta.env.VITE_API_URL
    //             }/products/?searchString=Spring&skip=0&take=10`,
    //             {
    //                 method: "GET",
    //                 mode: "cors",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     Authorization: `Bearer ${localStorage.getItem(
    //                         "ecommercetoken"
    //                     )}`,
    //                 },
    //             }
    //         )
    //             .then((result) => result.json())
    //             .then((serializedData) => superjson.deserialize(serializedData))
    //             .then((data) => {
    //                 // console.log(data);
    //                 setActiveProducts(
    //                     data.map((product) => {
    //                         // console.log(product);
    //                         return (
    //                             <Col
    //                                 className="d-flex justify-content-center align-items-stretch"
    //                                 key={product._id}
    //                             >
    //                                 <Product
    //                                     productProp={product}
    //                                     isAdmin={user.isAdmin}
    //                                 />
    //                             </Col>
    //                         );
    //                     })
    //                 );
    //                 setIsLoading(false);
    //             })
    //             .catch((error) => {
    //                 return `ERROR! ${error}`;
    //             });
    //     }
    // }, []);

    // useEffect(() => {
    //     if (user.isAdmin) {
    //         setIsLoading(true);
    //         fetch(`${import.meta.env.VITE_API_URL}/products/all`, {
    //             method: "GET",
    //             mode: "cors",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${localStorage.getItem(
    //                     "ecommercetoken"
    //                 )}`,
    //             },
    //         })
    //             .then((result) => result.json())
    //             .then((data) => {
    //                 // console.log(data);
    //                 setActiveProducts(
    //                     data.map((product) => {
    //                         // console.log(product);
    //                         return (
    //                             <Col
    //                                 className="d-flex justify-content-center align-items-stretch"
    //                                 key={product.id}
    //                             >
    //                                 <Product
    //                                     productProp={product}
    //                                     isAdmin={user.role === "admin"}
    //                                 />
    //                             </Col>
    //                         );
    //                     })
    //                 );
    //                 setIsLoading(false);
    //             })
    //             .catch((error) => {
    //                 return `ERROR! ${error}`;
    //             });
    //     }
    // }, [user]);

    // isLoading ? (
    //     <Row className="text-center mt-5">
    //         <Col>
    //             <Spinner animation="grow" role="status">
    //                 <span className="visually-hidden">Loading...</span>
    //             </Spinner>
    //         </Col>
    //     </Row>
    // ) :
    return (
        <>
            <h1 className="my-5 text-center">Products Page</h1>
            <Row xs={1} sm={2} lg={3}>
                {/* {activeProducts} */}
                {products.map((product) => {
                    // console.log(product);
                    return (
                        <Col
                            className="d-flex justify-content-center align-items-stretch"
                            key={product.id}
                        >
                            <Product
                                productProp={product}
                                isAdmin={user.role === "admin"}
                            />
                        </Col>
                    );
                })}
            </Row>
        </>
    );
}

export async function loader() {
    const response = await fetch(
        `${
            import.meta.env.VITE_API_URL
        }/products/?searchString=&skip=0&take=10`,
        {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem(
                    "ecommercetoken"
                )}`,
            },
        }
    );
    const serializedData = await response.json();
    const data = await json.deserialize(serializedData);
    return data;
}
