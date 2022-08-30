import React, { useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

function SearchBox() {
  const [keyword, setKeyword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/?keyword=${keyword}&page=1`);
    } else {
      navigate(location.pathname);
    }
  };

  return (
    <Form onSubmit={submitHandler} inline="true">
      <Row>
        <Col>
          <Form.Control
            type="text"
            name="q"
            onChange={(e) => setKeyword(e.target.value)}
            className="mr-sm-2 ml-sm-5"
          ></Form.Control>
        </Col>
        <Col>
          <Button type="submit" variant="outline-danger" className="p-2">
            Cerca
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default SearchBox;
