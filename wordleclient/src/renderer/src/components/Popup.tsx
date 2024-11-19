import React from "react";
import "../styles/Popup.css";

interface PopupProps {
  message: string;
  visible: boolean;
}

const Popup: React.FC<PopupProps> = ({ message, visible }) => {
  return <div className={`popup ${visible ? "visible" : ""}`}>{message}</div>;
};

export default Popup;
