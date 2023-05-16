import React, { Component } from "react";
import "../scss/components/ErrorBoundary.scss";
import globalContext from "../context/GlobalContext";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: null };
    // get user from global context
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can log the error here
    const errorReport = {
      error: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    };

    // Send the error report to info
    const message = {
      to: "dotsinfo@dotsoil.com",
      subject: "Error Report ",
      text: JSON.stringify(errorReport),
    };
    // Send the error report to dotsinfo@dotsoil.com
    this.setState({ message });
  }

  handleResetError = () => {
    this.setState({ hasError: false });
  };

  handleReportError = () => {
    window.open(
      `mailto:${this.state.message.to}?subject=${this.state.message.subject}&body=${this.state.message.text}`
    );
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Something went wrong.</h1>
          {/* show some error image construction agriculture with message 
            add button report via mail to admin
            add button refresh page
          */}
          <p>
            Please refresh the page or report the issue to the admin via email
          </p>
          <button className="report-button" onClick={this.handleReportError}>
            Report
          </button>
          <button className="refresh-button" onClick={this.handleResetError}>
            Refresh
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
