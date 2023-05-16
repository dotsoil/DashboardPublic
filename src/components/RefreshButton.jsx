import React from "react";
import { Button } from "react-bootstrap";
import { RiRefreshLine } from "react-icons/ri";

// spin vsc-refresh icon when clicked
function RefreshButton({ onClick, disabled }) {
  return (
    <Button variant="outline-secondary" onClick={onClick} title="Refresh" disabled={disabled}>
      <RiRefreshLine color="primary" />
      REFRESH
    </Button>
  );
}
export default RefreshButton;
