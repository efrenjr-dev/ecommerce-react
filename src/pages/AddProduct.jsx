import { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { Form } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { getCookie } from "../utils/cookieService";
import json from "superjson";
import fetchWrapper from "../utils/fetchWrapper";

export default function AddProduct() {
    const [isFilled, setIsFilled] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity , setQuantity] = useState(0);

    useEffect(() => {
        if (name !== "" && description !== "" && price !== 0) {
            setIsFilled(true);
        } else setIsFilled(false);
    }, [name, description, price]);

    function resetForm() {
        setName("");
        setDescription("");
        setPrice(0);
        setQuantity(0);
    }

    async function createProduct() {
        const loadingToast = toast.loading("Adding new product");
        try {
            // console.log(name, description, price);
            const productResponse = await fetchWrapper(
                `${import.meta.env.VITE_API_URL}/products/`,
                {
                    method: "POST",
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
            if (productResponse.ok) {
                const serializedData = await productResponse.json();
                const productData = json.deserialize(serializedData);
                toast.success(`Item ${productData.name} has been added`, {
                    id: loadingToast,
                });
            } else {
                toast.error("Adding product has failed.", { id: loadingToast });
            }
        } catch (err) {
            toast.error(err.toString(), { id: loadingToast });
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        createProduct();
        resetForm();
    }

    return (
        <>
            <Row className="justify-content-center">
                <Col xs md="6">
                    <h4 className="my-5 text-center">Add Product</h4>
                    <Form
                        onSubmit={(e) => {
                            handleSubmit(e);
                        }}
                    >
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
                                as="textarea"
                                rows={3}
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
                        <Form.Group className="mb-3">
                            <Form.Label>Quantity:</Form.Label>
                            <Form.Control
                                type="number"
                                value={quantity}
                                onChange={(e) => {
                                    setQuantity(e.target.value);
                                }}
                                placeholder="Enter Quantity"
                                required
                            />
                        </Form.Group>
                        <Button
                            className="w-100"
                            variant="dark"
                            type="submit"
                            disabled={!isFilled}
                        >
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </>
    );
}
