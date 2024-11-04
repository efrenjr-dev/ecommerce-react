import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import { toast } from "react-hot-toast";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../userContext";
import fetchWrapper from "../utils/fetchWrapper";
import json from "superjson";
import { getCookie } from "../utils/cookieService";

export default function UpdateProduct() {
    const product = useLoaderData();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [price, setPrice] = useState(product.price);

    useEffect(() => {
        if (name !== "" && description !== "" && price != 0) {
            setIsFilled(true);
        } else setIsFilled(false);
    }, [name, description, price]);

    async function updateProduct() {
        setIsLoading(true);
        const loadingToast = toast.loading("Updating product details");
        try {
            console.log(name, description, price);
            const response = await fetchWrapper(
                `${import.meta.env.VITE_API_URL}/products/product/${
                    product.id
                }`,
                {
                    method: "PATCH",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getCookie("accessToken")}`,
                    },
                    body: json.stringify({
                        name: name,
                        description: description,
                        price: parseFloat(price),
                    }),
                }
            );
            const serializedData = await response.json();
            const data = json.deserialize(serializedData);
            console.log(data);
            if (data.id) {
                toast.success("Product has been updated successfully.", {
                    id: loadingToast,
                });
                product.name = name;
                product.description = description;
                product.price = price;
            } else {
                toast.error(data.message, {
                    id: loadingToast,
                });
            }
        } catch (err) {
            toast.error(err.toString(), {
                id: loadingToast,
            });
        }
        setIsLoading(false);
    }

    const handleReset = () => {
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProduct();
    };

    const handleCancel = () => {
        setIsLoading(true)
        navigate(-1);
    };

    return (
        <>
            <Row className="justify-content-center">
                <Col xs md="6">
                    <h4 className="my-5 text-center">Edit Product Details</h4>
                    <Form
                        onSubmit={(e) => {
                            handleSubmit(e);
                        }}
                    >
                        <Form.Group className="mb-3">
                            <Form.Label>Product ID:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={product.id}
                                required
                                disabled
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Product Name:</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                                placeholder="Enter Product Name"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Product Description:</Form.Label>
                            <Form.Control
                                type="text"
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                                placeholder="Enter Product Description"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price:</Form.Label>
                            <Form.Control
                                type="number"
                                value={price}
                                onChange={(e) => {
                                    setPrice(e.target.value);
                                }}
                                placeholder="Enter Product Price"
                                required
                            />
                        </Form.Group>
                        {/* <Form.Group className="mb-3">
                            <Form.Label>Active:</Form.Label>
                            <Form.Check
                                type="switch"
                                checked={isActive}
                                onChange={() => {
                                    setIsActive(!isActive);
                                }}
                            />
                        </Form.Group> */}
                        <Button
                            variant="outline-dark"
                            className="mx-1 mb-2"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="outline-dark"
                            className="mx-1 mb-2"
                            type="reset"
                            disabled={isLoading}
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                        <Button
                            variant="dark"
                            className="mx-1 mb-2"
                            type="submit"
                            disabled={!isFilled || isLoading}
                        >
                            Confirm Update
                        </Button>
                    </Form>
                </Col>
            </Row>
        </>
    );
}

export const loader = async ({ params }) => {
    return fetchWrapper(
        `${import.meta.env.VITE_API_URL}/products/product/${params.productId}`
    )
        .then((result) => result.json())
        .then((serializedData) => json.deserialize(serializedData))
        .catch((error) => error);
};
