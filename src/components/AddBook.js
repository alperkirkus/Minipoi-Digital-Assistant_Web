import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Form, Table, Button, Spinner, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
function AddBook() {
  const [books, setBooks] = useState([]);

  const [bookName, setBookName] = useState("");
  const [loading, setloading] = useState(false);

  const [show, setShow] = useState(false);

  const [selectedBook, setSelectedBook] = useState(null);
  const [updateBookName, setUpdateBookName] = useState("");

  //get all books
  useEffect(() => {
    getBooks();
  }, []);

  const getBooks = () => {
    setloading(true);
    axios
      .get("https://mini-back-12.herokuapp.com/api/book/all")
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

  const addBook = (e) => {
    e.preventDefault();

    setloading(true);
    axios
      .post("https://mini-back-12.herokuapp.com/api/book/add", { bookName })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Book has been added succesfuly",
        });
        setBookName("");

        getBooks();

        setloading(false);
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

  const openUpdateModal = (item) => {
    setShow(true);

    setUpdateBookName(item.bookName);
    setSelectedBook(item);
  };

  const updateBookProcess = () => {
    setloading(true);
    axios
      .put("https://mini-back-12.herokuapp.com/api/book/update", {
        bookName: updateBookName,
        id: selectedBook.id,
      })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Book has been updated succesfuly",
        });
        setUpdateBookName("");

        getBooks();

        setShow(false);

        setloading(false);
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
    <Row>
      <Col xs={12} md={6}>
        <Form onSubmit={addBook}>
          <Form.Group className="mb-3">
            <Form.Label>Book Name</Form.Label>
            <Form.Control
              onChange={(e) => {
                setBookName(e.target.value);
              }}
              value={bookName}
              type="text"
              placeholder="Enter book name"
            />
          </Form.Group>

          <Button disabled={bookName === ""} variant="primary" type="submit">
            Add Book
          </Button>
        </Form>
      </Col>
      <Col xs={12} md={6}>
        {loading ? (
          <Spinner animation="border" variant="info" />
        ) : (
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Book Name</th>
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
                        onClick={() => openUpdateModal(item)}
                        variant="warning"
                      >
                        Update
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Col>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedBook?.bookName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Book Name</Form.Label>
          <Form.Control
            onChange={(e) => {
              setUpdateBookName(e.target.value);
            }}
            value={updateBookName}
            type="text"
            placeholder="Enter new book name"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button
            disabled={updateBookName === ""}
            variant="primary"
            onClick={updateBookProcess}
          >
            Update Book
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
}

export default AddBook;
