import { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { Form } from "react-bootstrap";
import { toast } from "react-hot-toast";

export default function AddProduct() {
    const [isFilled, setIsFilled] = useState(false);
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);

    useEffect(() => {
        if (productName !== "" && description !== "" && price !== 0) {
            setIsFilled(true);
        } else setIsFilled(false);
    }, [productName, description, price]);

    function resetForm() {
        setProductName("");
        setDescription("");
        setPrice(0);
    }

    async function createProduct() {
        const loadingToast = toast.loading("Adding new product");
        try {
            console.log(productName, description, price);
            const productResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/products/`,
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "ecommercetoken"
                        )}`,
                    },
                    body: JSON.stringify({
                        productName: productName,
                        description: description,
                        price: price,
                    }),
                }
            );
            const productData = await productResponse.json();
            toast.success(`Item ${productData.productName} has been added`, {
                id: loadingToast,
            });
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
                    <h1 className="my-5 text-center">Add Product</h1>
                    <Form
                        onSubmit={(e) => {
                            handleSubmit(e);
                        }}
                    >
                        <Form.Group className="mb-3">
                            <Form.Label>Product Name:</Form.Label>
                            <Form.Control
                                type="text"
                                value={productName}
                                onChange={(e) => {
                                    setProductName(e.target.value);
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
                        <Button type="submit" disabled={!isFilled}>
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </>
    );
}

// {
//     "productName": "Uniball",
//     "description": "ink pen",
//     "price": 25
// }
