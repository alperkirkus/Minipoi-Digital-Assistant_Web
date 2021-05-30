import React from "react";
import { Formik } from "formik";
import { Form, Button, Col, Row, Alert, Container } from "react-bootstrap";
import logo from "../assets/logo.png";

import Swal from "sweetalert2";
import axios from "axios";

function Login({setUser}) {


  return (
    <Container>
 <Row className="justify-content-md-center">
      <Col xs lg="4">
        <img alt="logo" className="center-logo" src={logo} />
        <Formik
          initialValues={{ email: "", password: "" }}
          validate={(values) => {
            const errors = {};
            if (!values.email) {
              errors.email = "Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            axios
              .post("https://mini-back-12.herokuapp.com/api/user/login-admin", values)
              .then(({ data }) => {

                localStorage.setItem("user",JSON.stringify(data))
                setUser(data)
                setSubmitting(false)
              })
              .catch((err) => {
                setSubmitting(false)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Email or password worng',
                  })
              });
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
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                {errors.email && touched.email && errors.email && (
                  <Alert variant={"danger"}>
                    {errors.email && touched.email && errors.email}
                  </Alert>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                {errors.password && touched.password && errors.password}
              </Form.Group>
              <div className="d-flex justify-content-center">
                <Button disabled={isSubmitting} variant="primary" type="submit">
                  Login
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
    </Container>
   
  );
}

export default Login;
