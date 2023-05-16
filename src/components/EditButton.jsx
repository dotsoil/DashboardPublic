// edit button component with pencil icon with props

import { EditSharp } from "@mui/icons-material";
import React from "react";
import { Button, Container } from "react-bootstrap";

import "../scss/components/EditButton.scss";

const EditButton = ({ text = "Edit", ...props }) => {
  return (
    <Container className="edit-button-container">
      <Button variant="outline-secondary" className="edit-button" {...props}>
        <span>
          {text}
          {/* nbsp */}
          &nbsp;
        </span>
        {/* Pencil icon */}
        <EditSharp />
      </Button>
    </Container>
  );
};

export default EditButton;
