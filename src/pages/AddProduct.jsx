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
import { schema, validateForm } from "../utils/validation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";

export default function AddProduct() {
    const MAX_IMAGES = 5;
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        quantity: 0,
        images: [],
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    function resetForm() {
        setFormData({
            name: "",
            description: "",
            price: 0,
            quantity: 0,
            images: [],
        });
        fileInputRef.current.value = "";
    }

    async function createProduct() {
        setIsLoading(true);
        const loadingToast = toast.loading("Adding new product");
        try {
            const formDataToSubmit = new FormData();

            formDataToSubmit.append("name", formData.name);
            formDataToSubmit.append("description", formData.description);
            formDataToSubmit.append("price", formData.price);
            formDataToSubmit.append("quantity", formData.quantity);

            formData.images.forEach((image) => {
                formDataToSubmit.append("images", image);
            });

            const productResponse = await fetchWrapper(
                `${import.meta.env.VITE_API_URL}/products/`,
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        // "Content-Type": "application/json",
                        Authorization: `Bearer ${getCookie("accessToken")}`,
                    },
                    body: formDataToSubmit,
                    // body: json.stringify({
                    //     name: formData.name,
                    //     description: formData.description,
                    //     price: parseFloat(formData.price),
                    // }),
                },
                navigate,
                location
            );
            if (productResponse.ok) {
                const serializedData = await productResponse.json();
                const productData = json.deserialize(serializedData);
                toast.success(
                    `Product ${productData.name} has been added successfully`,
                    {
                        id: loadingToast,
                    }
                );
                resetForm();
            } else {
                toast.error("Adding product has failed.", { id: loadingToast });
            }
        } catch (err) {
            toast.error(err.toString(), { id: loadingToast });
        }
        setIsLoading(false);
    }

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        const selectedFiles = Array.from(e.target.files);

        if (selectedFiles.length + formData.images.length > MAX_IMAGES) {
            toast.error(`You can only upload up to ${MAX_IMAGES} images.`);
            return; // Don't update state if limit exceeded
        }
        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...selectedFiles],
        }));
    };

    const handleRemoveImage = (index) => {
        setFormData((prev) => {
            const updatedImages = [...prev.images];
            updatedImages.splice(index, 1); // Remove the image at the specified index
            return {
                ...prev,
                images: updatedImages,
            };
        });
    };

    function handleSubmit(e) {
        e.preventDefault();
        const validationErrors = validateForm(schema.addProduct, formData);
        setErrors(validationErrors || {});
        if (validationErrors) return;

        createProduct();
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
                                disabled={isLoading}
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
                                disabled={isLoading}
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
                                disabled={isLoading}
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
                                disabled={isLoading}
                                required
                                isInvalid={!!errors.quantity}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.quantity}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Product Images:</Form.Label>
                            <Form.Control
                                type="file"
                                name="images"
                                multiple
                                onChange={handleImageChange}
                                accept="image/*"
                                ref={fileInputRef}
                                disabled={isLoading}
                                isInvalid={errors.images}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.images}
                            </Form.Control.Feedback>
                            {formData.images.length > 0 && (
                                <div className="mt-2 mt-3">
                                    <Form.Label>{`Selected Images (${formData.images.length}):`}</Form.Label>
                                    <ul>
                                        {formData.images.map((image, index) => {
                                            return (
                                                <li key={index}>
                                                    {image.name}
                                                    <Button
                                                        variant="outline-danger"
                                                        className="btn-sm ms-2"
                                                        onClick={() =>
                                                            handleRemoveImage(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faXmark}
                                                        />
                                                    </Button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </Form.Group>
                        <Button
                            className="w-100"
                            variant="dark"
                            type="submit"
                            disabled={isLoading}
                        >
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </>
    );
}
