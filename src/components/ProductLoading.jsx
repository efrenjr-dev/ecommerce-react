import Placeholder from "react-bootstrap/Placeholder";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

export default function ProductLoading({ items = 8 }) {
    const placeholders = [];
    for (let i = 0; i < items; i++) {
        placeholders.push(
            <Col className="mb-4" key={i}>
                <Card className="w-100">
                    <Card.Body>
                        <Placeholder as={Card.Title} animation="glow">
                            <Placeholder xs={6} />
                        </Placeholder>
                        <Placeholder as={Card.Text} animation="glow">
                            <Placeholder xs={7} /> <Placeholder xs={4} />{" "}
                            <Placeholder xs={4} /> <Placeholder xs={6} />{" "}
                            <Placeholder xs={8} />
                        </Placeholder>
                    </Card.Body>
                </Card>
            </Col>
        );
    }
    return (
        <div aria-hidden="true">
            {/* <h3 className="my-5 text-center">
                <Placeholder xs={2} />{" "}
            </h3> */}
            <Row xs={1} sm={3} lg={4} className="">
                {placeholders}
            </Row>
        </div>
    );
}
