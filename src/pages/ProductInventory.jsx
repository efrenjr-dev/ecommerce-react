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

export default function ProductInventory() {
    const product = useLoaderData();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [name, setName] = useState(product.name);
    const [quantity, setQuantity] = useState(
        product.Product_Inventory.quantity
    );
    const [updateQuantity, setUpdateQuantity] = useState(1);

    useEffect(() => {
        if (updateQuantity != ""&&updateQuantity>0) {
            setIsFilled(true);
        } else setIsFilled(false);
    }, [updateQuantity]);

    async function updateStock(action) {
        setIsLoading(true);
        const loadingToast = toast.loading("Updating inventory...");
        try {
            // console.log(name, quantity);
            const response = await fetchWrapper(
                `${import.meta.env.VITE_API_URL}/products/${action}`,
                {
                    method: "PATCH",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getCookie("accessToken")}`,
                    },
                    body: json.stringify({
                        productId: product.id,
                        quantity: parseInt(updateQuantity),
                    }),
                }
            );
            const serializedData = await response.json();
            const data = json.deserialize(serializedData);
          // console.log(data);
            if (data.id) {
                toast.success(
                    "Product inventory updated successfully.",
                    {
                        id: loadingToast,
                    }
                );
                setQuantity(data.Product_Inventory.quantity);
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

    const handleSubmit = (e, action) => {
        e.preventDefault();
        updateStock(action);
    };

    const handleCancel = () => {
        setIsLoading(true);
        navigate(`/products/${product.id}`);
    };

    return (
        <>
            <Row className="justify-content-center">
                <Col xs md="6">
                    <h4 className="my-5 text-center">
                        Update Product Inventory
                    </h4>
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
                                disabled
                                type="text"
                                value={name}
                                placeholder="Enter Product Name"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Available Stock:</Form.Label>
                            <Form.Control
                                disabled
                                type="text"
                                value={quantity}
                                placeholder="0"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 flex-row d-flex align-items-center justify-content-center">
                            <Button
                                disabled={!isFilled || isLoading}
                                variant="danger"
                                className=""
                                onClick={(e) => handleSubmit(e, "consume")}
                            >
                                Withdraw
                            </Button>
                            <Form.Control
                                className="mx-3"
                                type="number"
                                value={updateQuantity}
                                onChange={(e) => {
                                    setUpdateQuantity(e.target.value);
                                }}
                                placeholder="0"
                                required
                            />
                            <Button
                                disabled={!isFilled || isLoading}
                                variant="success"
                                className=""
                                onClick={(e) => handleSubmit(e, "replenish")}
                            >
                                Replenish
                            </Button>
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
                        <div className="mt-5 justify-content-center d-flex">
                            <Button
                                variant="outline-dark"
                                className="mx-1 mb-2 "
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                Back
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
