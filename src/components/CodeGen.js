import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import {
  Form,
  Alert,
  Button,
  Row,
  Col,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { Formik } from "formik";
function CodeGen() {
  const [books, setBooks] = useState([]);
  const [codes, setCodes] = useState([]);
  const [bookId, setBookId] = useState("");
  const [loading, setloading] = useState(false);

  //get all books
  useEffect(() => {
    setloading(true);
    axios
      .get("https://minipoi-back.herokuapp.com/api/book/all")
      .then(({ data }) => {
        if (data.books.length > 0) {
          setBooks(data.books);
          setBookId(data.books[0].id);
          setloading(false);
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong",
        });
        setloading(false);
      });
  }, []);

  const makeid = (length) => {
    var result = [];
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength))
      );
    }
    return result.join("");
  };

  const sendCodes = () => {
    setloading(true);
    axios
      .post("https://minipoi-back.herokuapp.com/api/code/add", {
        codes,
        bookId,
      })
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Your codes has been added succesfuly",
        });
        setloading(false);
        setCodes([]);
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong",
        });
        setloading(false);
      });
  };

  return (
    <div>
      <Row className="justify-content-md-center">
        <Col xs lg="6">
          <Formik
            initialValues={{ amount: 1 }}
            validate={(values) => {
              const errors = {};

              if (
                isNaN(parseInt(values.amount)) ||
                parseInt(values.amount) < 1
              ) {
                errors.amount = "Amount must be minimum 1";
              }

              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              let tempCodes = [];
              for (let i = 0; i < parseInt(values.amount); i++) {
                tempCodes.push(makeid(25));
              }

              setCodes(tempCodes);
              setSubmitting(false);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <Form onSubmit={handleSubmit}>
                {loading ? (
                  <Spinner animation="border" variant="info" />
                ) : (
                  <Form.Group>
                    <Form.Label>Books</Form.Label>
                    <Form.Control
                      onChange={(e) => {
                        setBookId(e.target.value);
                      }}
                      value={bookId}
                      name="to"
                      as="select"
                    >
                      {books.map((item, index) => {
                        return (
                          <option key={index} value={item.id}>
                            {item.bookName}
                          </option>
                        );
                      })}
                    </Form.Control>
                  </Form.Group>
                )}

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.amount}
                  />
                  {errors.amount && touched.amount && errors.amount && (
                    <Alert variant={"danger"}>
                      {errors.amount && touched.amount && errors.amount}
                    </Alert>
                  )}
                </Form.Group>
                <div className="d-flex justify-content-center">
                  <Button disabled={isSubmitting} variant="info" type="submit">
                    Generate
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Col>

        <Col xs lg="6">
          <h4>Generated Codes</h4>
          <div className="d-flex justify-content-center">
            {loading ? (
              <Spinner animation="border" variant="info" />
            ) : (
              <Button
                onClick={sendCodes}
                disabled={codes.length === 0}
                variant="warning"
                type="submit"
              >
                Accept
              </Button>
            )}
          </div>
          <ListGroup>
            {codes.map((item, i) => {
              return <ListGroup.Item key={i}>{item}</ListGroup.Item>;
            })}
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
}

export default CodeGen;
