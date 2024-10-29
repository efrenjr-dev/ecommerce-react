import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../userContext";

export default function UpdateProduct() {
    const { productId } = useParams();
    const { user } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (productName !== "" && description !== "" && price !== 0) {
            setIsFilled(true);
        } else setIsFilled(false);
    }, [productName, description, price]);
    const [initialDetails, setInitialDetails] = useState({
        productName: null,
        description: null,
        price: 0,
        isActive: false,
    });

    useEffect(() => {
        // console.log(productId);
        setIsLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/products/${productId}`)
            .then((result) => result.json())
            .then((data) => {
                // console.log(data);
                setInitialDetails({
                    productName: data.productName,
                    description: data.description,
                    price: data.price,
                    isActive: data.isActive,
                });
                setProductName(data.productName);
                setDescription(data.description);
                setPrice(data.price);
                setIsActive(data.isActive);

                setIsLoading(false);
            })
            .catch((error) => error);
    }, []);

    async function updateProduct() {
        const loadingToast = toast.loading("Updating product details");
        try {
            console.log(productName, description, price, isActive);
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/products/${productId}`,
                {
                    method: "PUT",
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
                        isActive: isActive,
                    }),
                }
            );
            const data = await response.json();
            console.log(data);
            if (data._id) {
                toast.success("Product has been updated successfully.", {
                    id: loadingToast,
                });
                setInitialDetails({
                    productName: productName,
                    description: description,
                    price: price,
                    isActive: isActive,
                });
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
    }

    const handleReset = () => {
        setProductName(initialDetails.productName);
        setDescription(initialDetails.description);
        setPrice(initialDetails.price);
        setIsActive(initialDetails.isActive);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProduct();
    };

    return (
        <>
            <Row className="justify-content-center">
                <Col xs md="6">
                    <h1 className="my-5 text-center">Update Product Page</h1>
                    <Form
                        onSubmit={(e) => {
                            handleSubmit(e);
                        }}
                    >
                        <Form.Group className="mb-3">
                            <Form.Label>Product ID:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={productId}
                                required
                                disabled
                            />
                        </Form.Group>
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
                        <Form.Group className="mb-3">
                            <Form.Label>Active:</Form.Label>
                            <Form.Check
                                type="switch"
                                checked={isActive}
                                onChange={() => {
                                    setIsActive(!isActive);
                                }}
                            />
                        </Form.Group>
                        <Button
                            type="submit"
                            disabled={!isFilled}
                            className="me-3"
                        >
                            Confirm Update
                        </Button>
                        <Button onClick={handleReset}>Reset</Button>
                    </Form>
                </Col>
            </Row>
        </>
    );
}
