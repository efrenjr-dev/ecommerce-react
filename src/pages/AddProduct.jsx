import { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { Form } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { getCookie } from "../utils/cookieService";
import json from "superjson";
import fetchWrapper from "../utils/fetchWrapper";
import { useLocation, useNavigate } from "react-router-dom";
import { addProductSchema, validateForm } from "../utils/validation";

export default function AddProduct() {
    const [isFilled, setIsFilled] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        quantity: 0,
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const location = useLocation();

    // useEffect(() => {
    //     if (formData.name !== "" && formData.price <= 0) {
    //         setIsFilled(true);
    //     } else setIsFilled(false);
    // }, [formData]);

    function resetForm() {
        setFormData({
            name: "",
            description: "",
            price: 0,
            quantity: 0,
        });
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
                        name: formData.name,
                        description: formData.description,
                        price: parseFloat(formData.price),
                    }),
                },
                navigate,
                location
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

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    function handleSubmit(e) {
        e.preventDefault();
        const validationErrors = validateForm(addProductSchema, formData);
        setErrors(validationErrors || {});
        if (validationErrors) return;

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
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter Product Name"
                                required
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Product Description:</Form.Label>
                            <Form.Control
                                type="text"
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter Product Description"
                                isInvalid={!!errors.description}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.description}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price:</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Enter Product Price"
                                required
                                isInvalid={!!errors.price}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.price}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Quantity:</Form.Label>
                            <Form.Control
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="Enter Quantity"
                                required
                                isInvalid={!!errors.quantity}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.quantity}
                            </Form.Control.Feedback>
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
