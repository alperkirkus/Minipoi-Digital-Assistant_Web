import React, { useState } from "react";
import { Container } from "react-bootstrap";

import Navs from "../components/Navs";
import CodeGen from "./CodeGen";
function Panel({ setUser }) {
  const [route, setRoute] = useState("home");

  const renderMenu = () => {
    if (route === "home") {
      return <div>This is the homepage for admin</div>;
    } else if (route === "code-gen") {
      return <CodeGen />;
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
