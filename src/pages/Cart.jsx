import { useContext, useEffect, useState } from "react";
import { UserContext } from "../userContext";
import CartList from "../components/CartList";
import { toast } from "react-hot-toast";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import json from "superjson";
import { useNavigate, useLoaderData } from "react-router-dom";

export default function Cart() {
    const shoppingCart = useLoaderData();
    const [isLoading, setIsLoading] = useState(false);
    const [cart, setCart] = useState(shoppingCart);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        let totalAmount = 0;
        if (cart && cart.Cart_Item.length > 0) {
            cart.Cart_Item.forEach(
                (cartItem) =>
                    (totalAmount =
                        totalAmount +
                        cartItem.Product.price * cartItem.quantity)
            );
            setTotal(totalAmount);
        }
    }, [cart]);

    const handleOrder = async (e) => {
        setIsLoading(true);
        let loadingToast = toast.loading("Adding order");
        let totalAmount = 0;

        // console.log(order);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/carts/checkout`,
                {
                    method: "POST",
                    mode: "cors",
                    credentials: "include",
                    headers: {
                        Authorization: `Bearer ${cookies.get("accessToken")}`,
                    },
                }
            );
            const serializedData = await response.json();
            const data = json.deserialize(serializedData);
            // console.log(data);
            setIsLoading(false);
            toast.success(data.message, {
                id: loadingToast,
            });
            navigate(`/order/${data.order.id}`);
        } catch (err) {
            toast.error(err.toString(), {
                id: loadingToast,
            });
        }
    };

    const onChangeQuantity = (e, cartItemId, quantity) => {
        e.preventDefault;
        setIsLoading(true);
        let totalAmount = 0;
        const updateBody = {
            quantity: quantity,
        };

        // setProductQuantity(1);

        fetch(`${import.meta.env.VITE_API_URL}/carts/item/${cartItemId}`, {
            method: "PATCH",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("accessToken")}`,
            },
            body: json.stringify(updateBody),
        })
            .then((result) => result.json())
            .then((serializedData) => json.deserialize(serializedData))
            .then((data) => {
                setCart(data.updatedCart);
                data.updatedCart.Cart_Item.forEach((cartItem) => {
                    totalAmount += cartItem.quantity * cartItem.Product.price;
                });
                setTotal(totalAmount);
            });

        setIsLoading(false);
    };

    return (
        <>
            <h1 className="text-center my-5">Your Cart</h1>
            {cart.Cart_Item.length > 0 ? (
                <Row xs={1} md={2}>
                    <Col md={8}>
                        <CartList
                            cartItems={cart.Cart_Item}
                            onChangeQuantity={onChangeQuantity}
                            isLoading={isLoading}
                        />
                    </Col>
                    <Col md={4} className="justify-content-center">
                        <Card>
                            <Card.Body>
                                <Table>
                                    <tr>
                                        <td>Total Amount</td>
                                        <td className="text-end">
                                            PHP {total.toFixed(2)}
                                        </td>
                                    </tr>
                                    {/* <tr>
                                        <td>VAT (12%)</td>
                                        <td className="text-end">
                                            {(total * 0.05).toFixed(2)}
                                        </td>
                                    </tr> */}
                                </Table>
                                <Button
                                    onClick={handleOrder}
                                    className="d-flex ms-auto"
                                >
                                    Checkout
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            ) : (
                <h5 className="text-center">Your cart is empty.</h5>
            )}
        </>
    );
}

export const loader = async () => {
    return await fetch(`${import.meta.env.VITE_API_URL}/carts`, {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("accessToken")}`,
        },
    })
        .then((response) => response.json())
        .then((serializedData) => json.deserialize(serializedData));
};
