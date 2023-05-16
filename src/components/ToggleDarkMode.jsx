import React from "react";
import { Form } from "react-bootstrap";
function ToggleDarkMode({ size, toggleTheme, theme }) {
  return (
    <Form>
      <Form.Switch
        id="custom-switch"
        onChange={toggleTheme}
        variant="primary"
        checked={theme === "light" ? false : true}
        // label in new line
        label={theme === "dark" ? "Dark Mode" : "Light Mode"}
      />
    </Form>
  );
}

export default ToggleDarkMode;
