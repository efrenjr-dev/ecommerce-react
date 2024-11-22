import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { toast } from "react-hot-toast";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import fetchWrapper from "../utils/fetchWrapper";
import json from "superjson";
import { getCookie } from "../utils/cookieService";
import { schema, validateForm } from "../utils/validation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";

export default function UpdateProduct() {
    const product = useLoaderData();
    const MAX_IMAGES = 5;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [formData, setFormData] = useState({
        name: product.name,
        description: product.description,
        price: product.price,
        isActive: product.isActive,
        existingImages: product.Image || [],
        newImages: [],
    });
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (
            formData.name !== "" &&
            formData.description !== "" &&
            formData.price >= 0
        ) {
            setIsFilled(true);
        } else setIsFilled(false);
    }, [formData]);

    async function updateProduct() {
        setIsLoading(true);
        const loadingToast = toast.loading("Updating product details...");
        try {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append("name", formData.name);
            formDataToSubmit.append("description", formData.description);
            formDataToSubmit.append("price", formData.price);
            formDataToSubmit.append("isActive", formData.isActive);

            formDataToSubmit.append(
                "existingImages",
                json.stringify(formData.existingImages)
            );

            formData.newImages.forEach((image) => {
                formDataToSubmit.append("newImages", image);
            });

            const response = await fetchWrapper(
                `${import.meta.env.VITE_API_URL}/products/product/${
                    product.id
                }`,
                {
                    method: "PATCH",
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
                    //     isActive: formData.isActive,
                    // }),
                },
                navigate,
                location
            );

            if (response.ok) {
                const serializedData = await response.json();
                const data = json.deserialize(serializedData);
                toast.success("Product has been updated successfully.", {
                    id: loadingToast,
                });
                product.name = data.name;
                product.description = data.description;
                product.price = data.price;
                product.isActive = data.isActive;
                product.Image = data.Image || [];

                resetForm();
            } else {
                toast.error("Failed to update product.", {
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

    const resetForm = () => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            isActive: product.isActive,
            existingImages: product.Image || [],
            newImages: [],
        });
        fileInputRef.current.value = "";
    };
    const handleReset = () => {
        resetForm();
    };

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleNewImageChange = (e) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const selectedFiles = Array.from(e.target.files);

        if (formData.newImages.length + selectedFiles.length > MAX_IMAGES) {
            toast.error(`You can only upload up to ${MAX_IMAGES} images.`);
            return;
        }

        setFormData((prev) => ({
            ...prev,
            newImages: [...prev.newImages, ...selectedFiles],
        }));
    };

    const handleRemoveExistingImage = (index) => {
        setFormData((prev) => {
            const updatedExistingImages = [...prev.existingImages];
            updatedExistingImages.splice(index, 1);
            return { ...prev, existingImages: updatedExistingImages };
        });
    };

    const handleRemoveNewImage = (index) => {
        setFormData((prev) => {
            const updatedNewImages = [...prev.newImages];
            updatedNewImages.splice(index, 1);
            return { ...prev, newImages: updatedNewImages };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        const validationErrors = validateForm(schema.updateProduct, formData);
        setErrors(validationErrors || {});
        if (validationErrors) return;
        updateProduct();
    };

    const handleCancel = () => {
        setIsLoading(true);
        navigate(`/products/${product.id}`);
    };

    return (
        <Container>
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
                                as="textarea"
                                rows={3}
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter Product Description"
                                disabled={isLoading}
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
                                disabled={isLoading}
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
                                disabled={isLoading}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Product Images:</Form.Label>
                            {formData.existingImages.length > 0 && (
                                <div className="mb-2">
                                    <Form.Label>Existing Images:</Form.Label>
                                    <ul>
                                        {formData.existingImages.map(
                                            (image, index) => (
                                                <li key={image.id}>
                                                    {`...${image.url.slice(
                                                        image.url.length - 40 ||
                                                            0
                                                    )}` || image.name}
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        className="ms-2"
                                                        onClick={() =>
                                                            handleRemoveExistingImage(
                                                                index
                                                            )
                                                        }
                                                        disabled={isLoading}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faXmark}
                                                        />
                                                    </Button>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                            <Form.Control
                                type="file"
                                multiple
                                onChange={handleNewImageChange}
                                accept="image/*"
                                ref={fileInputRef}
                                isInvalid={!!errors.newImages}
                                disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.newImages}
                            </Form.Control.Feedback>
                            {formData.newImages.length > 0 && (
                                <ul className="mt-2">
                                    {formData.newImages.map((image, index) => (
                                        <li key={index}>
                                            {image.name}
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                className="ms-2"
                                                onClick={() =>
                                                    handleRemoveNewImage(index)
                                                }
                                                disabled={isLoading}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faXmark}
                                                />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Form.Group>

                        <div className="d-flex">
                            <Button
                                variant="outline-dark"
                                className="me-auto"
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                Back
                            </Button>
                            <Button
                                variant="dark"
                                className="mx-1"
                                type="reset"
                                disabled={isLoading}
                                onClick={handleReset}
                            >
                                Reset
                            </Button>
                            <Button
                                variant="danger"
                                className="ms-1"
                                type="submit"
                                disabled={!isFilled || isLoading}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
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
