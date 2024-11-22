import { Badge, Col, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import formatPrice from "../utils/formatPrice";

export default function Product({
    productProp,
    userRole,
    productURL = `/products/${productProp.id}`,
}) {
    const stock = productProp.Product_Inventory.quantity;

    return (
        <Card
            bg="light"
            as={Link}
            to={productURL}
            className=" text-link border-0 shadow-sm m-2 w-100"
        >
            <Card.Img
                variant="top"
                className="img-fluid"
                style={{
                    height: "200px" /* Fixed height */,
                    objectFit: "cover" /* Maintain aspect ratio */,
                }}
                src={productProp.Image[0]?.url}
            />
            <Card.Body className="border-top">
                <Card.Title>{productProp.name}</Card.Title>

                <Card.Subtitle>{formatPrice(productProp.price)}</Card.Subtitle>

                {/* <Card.Text>{productProp.description}</Card.Text> */}
            </Card.Body>
            {userRole === "admin" && (
                <Card.Footer className="text">
                    <Row className="d-flex flex-column">
                        <Col>
                            {stock > 10 ? (
                                <span>Available stock: {stock}</span>
                            ) : (
                                <span>
                                    Available stock:{" "}
                                    <Badge pill bg="danger">
                                        {stock}
                                    </Badge>
                                </span>
                            )}
                        </Col>
                        <Col>
                            Status:{" "}
                            {productProp.isActive ? (
                                <span>Active</span>
                            ) : (
                                <span className="text-danger">Inactive</span>
                            )}
                        </Col>
                    </Row>
                </Card.Footer>
            )}
        </Card>
    );
}
