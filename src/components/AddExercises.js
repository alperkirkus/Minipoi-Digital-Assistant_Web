import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Form, Table, Button, Spinner, Alert } from "react-bootstrap";
import Swal from "sweetalert2";
import { Formik } from "formik";
import UploadFile from "./UploadFile";

const fileRootUrl = "https://minipoi-back.herokuapp.com/";
const attainment = [
  {
    name: "PARÇA BÜTÜN İLİŞKİSİ",
    des: "Soyut akıl yürütme, görsel uyaranın daha küçük bir parçası ve bütünü arasındaki ilişkiyi kavrama becerisini ifade etmektedir.",
  },

  {
    name: "BÜTÜNSEL & GÖRSEL ALGI",
    des: "Görsel işlemleme, akıl yürütme, uyaranın bütün olarak değerlendirilmesini ifade etmektedir.",
  },

  {
    name: "UZUN SÜRELİ DİKKAT",
    des: "Dikkat ve konsantrasyonun belli bir uyaran üzerinde uzun süre sürdürülmesini ifade etmektedir.",
  },

  {
    name: "DİL BECERİSİ",
    des: "İçinde bulunulan gelişim basamağına uygun olarak çıkarılan sesleri ve üretilen sözel ifadelerin gelişimini ifade etmektedir. Sözel akıcılık ve kelimeleri kullanma becerisini de kapsamaktadır.",
  },

  {
    name: "AYIRT ETME & ORGANİZASYON",
    des: "Görsel uyaranların birbirinden farklılaştıkları özellikleri algılamayı ve bunlara göre bir yapı oluşturmayı ifade etmektedir.",
  },
];
function AddExercises() {
  const [loading, setloading] = useState(false);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const [files, setFiles] = useState([]);

  const [exercises, setExercises] = useState([]);

  //get all books
  useEffect(() => {
    getBooks();
  }, []);

  const getBooks = () => {
    setloading(true);
    axios
      .get("https://minipoi-back.herokuapp.com/api/book/all")
      .then(({ data }) => {
        if (data.books.length > 0) {
          setBooks(data.books);
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
  };

  useEffect(() => {
    if (selectedBook) {
      getExercise();
    }
  }, [selectedBook]);

  const getExercise = () => {
    setloading(true);
    axios
      .get("https://minipoi-back.herokuapp.com/api/book-ex/" + selectedBook.id)
      .then(({ data }) => {
        setExercises(data.bookex);
        setloading(false);
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong",
        });
        setloading(false);
      });
  };

  const removeExercise = (id) => {
    setloading(true);
    axios
      .delete("https://minipoi-back.herokuapp.com/api/book-ex/" + id)
      .then(({}) => {
        setloading(false);

        Swal.fire({
          icon: "success",
          title: "Sucess",
          text: "Exercise has been removed successfuly",
        });
        getExercise(); // update and get last
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong",
        });
        setloading(false);
      });
  };
  return (
    <Row>
      <Col xs={12} md={6}>
        <h3>Selected Book : {selectedBook?.bookName}</h3>
        <Formik
          initialValues={{
            name: "",
            contScore: 1,
            exerciseAttainmentName: attainment[0].name,
            exerciseAttainmentDes: attainment[0].des,
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = "Required";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            if (files.length > 0) {
              // image existing
              values.exerciseAttainmentName =
                attainment[parseInt(values.exerciseAttainmentName)].name;
              let data = {
                ...values,
                bookId: selectedBook.id,
              };

              const formData = new FormData();
              formData.append("file", files[files.length - 1]);
              formData.append("data", JSON.stringify(data));

              axios
                .post(
                  "https://minipoi-back.herokuapp.com/api/book-ex/add-exercise",
                  formData
                )
                .then(() => {
                  Swal.fire({
                    icon: "success",
                    title: "Sucess",
                    text: "Exercise has been added successfuly",
                  });
                  setFiles([]);
                  getExercise();
                  resetForm();
                  setSubmitting(false);
                })
                .catch(() => {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong",
                  });
                  setSubmitting(false);
                });
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please add exercise image !!",
              });

              setSubmitting(false);
            }
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
            setFieldValue,
            /* and other goodies */
          }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Exercise Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
                {errors.name && touched.name && errors.name && (
                  <Alert variant="danger">
                    {errors.name && touched.name && errors.name}
                  </Alert>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Exercise Attainment Name</Form.Label>
                <Form.Control
                  as="select"
                  type="text"
                  name="exerciseAttainmentName"
                  onChange={(e) => {
                    setFieldValue("exerciseAttainmentName", e.target.value);

                    setFieldValue(
                      "exerciseAttainmentDes",
                      attainment[parseInt(e.target.value)].des
                    );
                  }}
                  onBlur={handleBlur}
                  value={values.exerciseAttainmentName}
                >
                  {attainment.map((item, i) => {
                    return (
                      <option key={i} value={i}>
                        {item.name}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Exercise Attainment Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  disabled
                  type="text"
                  name="exerciseAttainmentDes"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.exerciseAttainmentDes}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contribution Score</Form.Label>
                <Form.Control
                  type="number"
                  name="contScore"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.contScore}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Exercise Image</Form.Label>
                <UploadFile files={files} setFiles={setFiles} />
              </Form.Group>

              <Button
                disabled={!selectedBook || isSubmitting}
                variant="primary"
                type="submit"
              >
                Add Exercise
              </Button>
            </Form>
          )}
        </Formik>
      </Col>

      <Col xs={12} md={6}>
        {loading ? (
          <Spinner animation="border" variant="info" />
        ) : (
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Exercise Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{item.id}</td>
                    <td>{item.bookName}</td>
                    <td>
                      <Button
                        onClick={() => setSelectedBook(item)}
                        variant="info"
                      >
                        Select
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Col>

      <Col xs={12} md={12}>
        {loading ? (
          <Spinner animation="border" variant="info" />
        ) : (
          <Table className="mt-3" responsive striped bordered hover>
            <thead>
              <tr>
                <th>Order</th>
                <th>Name</th>
                <th>Image</th>
                <th>Contribution Score</th>
                <th>Attainment Name</th>
                <th>Attainment Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exercises.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item.name}</td>
                    <td>
                      <img
                        className="exercise-img"
                        src={fileRootUrl + item.exerciseImg}
                      />
                    </td>
                    <td>{item.contScore}</td>
                    <td>{item.exerciseAttainmentName}</td>
                    <td>{item.exerciseAttainmentDes}</td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => {
                          removeExercise(item.id);
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
}

export default AddExercises;
