import React from "react";
import { Button } from "react-bootstrap";
import { PowerRounded } from "@mui/icons-material";

function PowerButton({ onClick, isOn,disabled }) {
  return (
    <Button variant="outline-secondary" onClick={onClick} title="Reboot" disabled={disabled}>
      <PowerRounded color={isOn ? "success" : "error"} />
      REBOOT
    </Button>
  );
}
export default PowerButton;
