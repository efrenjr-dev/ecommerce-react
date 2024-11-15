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
import { updateProductSchema, validateForm } from "../utils/validation";

export default function UpdateProduct() {
    const product = useLoaderData();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [formData, setFormData] = useState({
        name: product.name,
        description: product.description,
        price: product.price,
        isActive: product.isActive,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (
            formData.name !== "" &&
            formData.description !== "" &&
            formData.price != 0
        ) {
            setIsFilled(true);
        } else setIsFilled(false);
    }, [formData]);

    async function updateProduct() {
        setIsLoading(true);
        const loadingToast = toast.loading("Updating product details");
        try {
            // console.log(name, description, price);
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
                        name: formData.name,
                        description: formData.description,
                        price: parseFloat(formData.price),
                        isActive: formData.isActive,
                    }),
                }
            );
            const serializedData = await response.json();
            const data = json.deserialize(serializedData);
            // console.log(data);
            if (data.id) {
                toast.success("Product has been updated successfully.", {
                    id: loadingToast,
                });
                product.name = formData.name;
                product.description = formData.description;
                product.price = formData.price;
                product.isActive = formData.isActive;
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
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            isActive: product.isActive,
        });
    };

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm(updateProductSchema, formData);
        setErrors(validationErrors || {});
        if (validationErrors) return;
        updateProduct();
    };

    const handleCancel = () => {
        setIsLoading(true);
        navigate(`/products/${product.id}`);
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
                                as="textarea"
                                rows={3}
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter Product Description"
                                required
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
                            <Form.Label>Active:</Form.Label>
                            <Form.Check
                                type="switch"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <div className="d-flex">
                            <Button
                                variant="outline-dark"
                                className="mx-1"
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                Back
                            </Button>
                            <Button
                                variant="outline-dark"
                                className="mx-1"
                                type="reset"
                                disabled={isLoading}
                                onClick={handleReset}
                            >
                                Reset
                            </Button>
                            <Button
                                variant="dark"
                                className="me-auto"
                                type="submit"
                                disabled={!isFilled || isLoading}
                            >
                                Confirm Update
                            </Button>
                        </div>
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
