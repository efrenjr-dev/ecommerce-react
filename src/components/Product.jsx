import { Badge } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

export default function Product({ productProp, userRole }) {
    let productURL = `/products/${productProp.id}`;
    const stock = productProp.Product_Inventory.quantity;

    // userRole === "admin"
    //     ? (productURL = `/update-product/${productProp.id}`)
    //     : (productURL = `/products/${productProp.id}`);
    return (
        <Card
            bg="light"
            as={Link}
            to={productURL}
            className=" text-link border-0 shadow-sm m-2 w-100"
        >
            {/* {userRole === "admin" && (
                <Card.Header>ID: {productProp.id}</Card.Header>
            )} */}
            <Card.Img variant="top" src="https://prd.place/350?padding=50" />
            <Card.Body className="border-top">
                <Card.Title>{productProp.name}</Card.Title>

                <Card.Subtitle>
                    Php {productProp.price.toFixed(2).toString()}
                </Card.Subtitle>

                <Card.Text>{productProp.description}</Card.Text>
            </Card.Body>
            {userRole === "admin" &&
                (stock > 10 ? (
                    <Card.Footer className="">
                        Available stock: {stock}
                    </Card.Footer>
                ) : (
                    <Card.Footer className="text">
                        Available stock: <Badge pill bg="danger">{stock}</Badge>
                    </Card.Footer>
                ))}
        </Card>
    );
}
