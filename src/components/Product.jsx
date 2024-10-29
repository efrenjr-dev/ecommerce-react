import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

export default function Product({ productProp, isAdmin }) {
    let productURL = "";
    isAdmin
        ? (productURL = `/updateproduct/${productProp.id}`)
        : (productURL = `/product/${productProp.id}`);
    return (
        <Card as={Link} to={productURL} className="mb-5 text-link">
            {isAdmin && <Card.Header>ID: {productProp.id}</Card.Header>}
            <Card.Img
                variant="top"
                src="https://prd.place/350?padding=50"
            />
            <Card.Body>
                <Card.Title>{productProp.name}</Card.Title>

                <Card.Subtitle>{productProp.description}</Card.Subtitle>

                <Card.Text>
                    {" "}
                    Php {productProp.price.toFixed(2).toString()}{" "}
                </Card.Text>
            </Card.Body>
            {isAdmin &&
                (productProp.isActive ? (
                    <Card.Footer className="text-success">Active</Card.Footer>
                ) : (
                    <Card.Footer className="text-warning">Inactive</Card.Footer>
                ))}
        </Card>
    );
}
