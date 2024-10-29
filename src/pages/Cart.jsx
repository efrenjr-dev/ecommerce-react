import { useContext, useEffect, useState } from "react";
import { UserContext } from "../userContext";
import CartList from "../components/CartList";
import { toast } from "react-hot-toast";
import { Button, Card, Col, Row, Table } from "react-bootstrap";

export default function Cart() {
    const { user } = useContext(UserContext);
    const [products, setProducts] = useState([]);
    const [cartList, setCartList] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        let cart = localStorage.getItem("ecommercecarts");
        if (cart) {
            JSON.parse(cart).forEach((item) => {
                if (item.id === user.id) {
                    setProducts(item.products);
                }
            });
        }
    }, [user]);

    useEffect(() => {
        let totalAmount = 0;
        let cart = localStorage.getItem("ecommercecarts");
        if (cart && products.length > 0) {
            cart = JSON.parse(cart).map((item) => {
                if (item.id === user.id) {
                    return { ...item, products: products };
                }
                return item;
            });
            localStorage.setItem("ecommercecarts", JSON.stringify(cart));
            products.forEach(
                (p) => (totalAmount = totalAmount + p.priceSold * p.quantity)
            );
            setTotal(totalAmount);
        }
    }, [products]);

    const handleOrder = async (e) => {
        let loadingToast = toast.loading("Adding order");
        let totalAmount = 0;
        let localCart = JSON.parse(localStorage.getItem("ecommercecarts"));
        products.forEach(
            (p) => (totalAmount = totalAmount + p.priceSold * p.quantity)
        );
        let order = { products: products, totalAmount: totalAmount };
        // console.log(order);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/users/createOrder`,
                {
                    method: "PUT",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "ecommercetoken"
                        )}`,
                    },
                    body: JSON.stringify(order),
                }
            );
            const data = await response.json();
            // console.log(data);
            toast.success(data.message, {
                id: loadingToast,
            });
            // console.log(localCart);
            localCart = JSON.stringify(
                localCart.filter((item) => {
                    return item.id !== user.id;
                })
            );
            // console.log(localCart);
            localStorage.setItem("ecommercecarts", localCart);
            setProducts([]);
        } catch (err) {
            toast.error(err.toString(), {
                id: loadingToast,
            });
        }
    };

    const onChangeQuantity = (e, productId, type) => {
        let totalAmount = 0;
        setProducts(
            products.map((p) => {
                // console.log(p);
                if (p.productId === productId) {
                    if (type === "input") {
                        if (e.target.value === 1) {
                            toast.error("Quantity cannot be less than 1", {
                                id: "quantityToast",
                            });
                            return { ...p };
                        } else if (e.target.value > 40) {
                            toast.error("Quantity cannot be more than 40", {
                                id: "quantityToast",
                            });
                            return { ...p };
                        } else {
                            totalAmount =
                                totalAmount + p.priceSold * e.target.value;
                            return { ...p, quantity: e.target.value };
                        }
                    } else if (type === "+") {
                        // console.log(productQuantity);
                        if (p.quantity >= 40) {
                            toast.error("Quantity cannot be more than 40", {
                                id: "quantityToast",
                            });
                            totalAmount = totalAmount + p.priceSold * 40;
                            return { ...p, quantity: 40 };
                        }
                        totalAmount =
                            totalAmount + p.priceSold * (p.quantity + 1);
                        return { ...p, quantity: Number(p.quantity) + 1 };
                    } else if (type === "-") {
                        // console.log(productQuantity);
                        if (p.quantity <= 1) {
                            toast.error("Quantity cannot be less than 1", {
                                id: "quantityToast",
                            });
                            totalAmount = totalAmount + p.priceSold * 1;
                            return { ...p, quantity: 1 };
                        }
                        totalAmount =
                            totalAmount + p.priceSold * (p.quantity - 1);
                        return { ...p, quantity: p.quantity - 1 };
                    }
                    totalAmount = totalAmount + p.priceSold * p.quantity;
                    // return p;
                }
                totalAmount = totalAmount + p.priceSold * p.quantity;
                return p;
            })
        );
        setTotal(totalAmount);
    };

    return (
        <>
            <h1 className="text-center my-5">Your Cart</h1>
            {products.length > 0 ? (
                <Row xs={1} md={2}>
                    <Col md={8}>
                        <CartList
                            products={products}
                            onChangeQuantity={onChangeQuantity}
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
