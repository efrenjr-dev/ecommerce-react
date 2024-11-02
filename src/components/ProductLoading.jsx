import Placeholder from "react-bootstrap/Placeholder";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

export default function ProductLoading() {
    return (
        <div aria-hidden="true">
            <h3 className="my-5 text-center">
                <Placeholder xs={2} />{" "}
            </h3>
            <Row xs={1} sm={2} lg={3} className="">
                <Col className="mb-4">
                    <Card>
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
                <Col className="mb-4">
                    <Card>
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
                <Col className="mb-4">
                    <Card>
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
                <Col className="mb-4">
                    <Card>
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
                <Col className="mb-4">
                    <Card>
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
                <Col className="mb-4">
                    <Card>
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
            </Row>
        </div>
    );
}
