import React, { useState } from "react";
import { Container } from "react-bootstrap";

import Navs from "../components/Navs";
import AddBook from "./AddBook";
import AddExercises from "./AddExercises";
import CodeGen from "./CodeGen";
function Panel({ setUser }) {
  const [route, setRoute] = useState("home");

  const renderMenu = () => {
    if (route === "home") {
      return <div>This is the home page</div>;
    } else if (route === "code-gen") {
      return <CodeGen />;
    } else if (route === "add-book") {
      return <AddBook />;
    } else if (route === "add-ex") {
      return <AddExercises />;
    }
  };
  return (
    <>
      <Navs setRoute={setRoute} setUser={setUser} />
      <Container>{renderMenu()}</Container>
    </>
  );
}

export default Panel;
