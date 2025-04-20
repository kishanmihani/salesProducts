import React, { useEffect } from "react";
import "./CustomeAlert.css";

const CustomeAlerts = ({ type = "success", message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // auto-close after 4s
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`custom-alert ${type}`}>
      <span>{message}</span>
      <button onClick={onClose}>&times;</button>
    </div>
  );
};

export default CustomeAlerts;