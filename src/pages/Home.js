import "./Home.css";
import Modal from "react-modal";
import React, { useState } from "react";
import LoginForm from "./components/LoginForm";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomModal = ({ isOpen, closeModal, onLoginSuccess, onLoginFail }) => {
  const customStyles = {
    content: {
      width: "50%",
      height: "50%",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Example Modal"
      style={customStyles}
    >
      <LoginForm onLoginSuccess={onLoginSuccess} onLoginFail={onLoginFail} />
    </Modal>
  );
};

function Home() {
  const notify = (message) => toast(message);

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleLoginSuccess = () => {
    notify("Login success!");
    closeModal();
  };

  const handleLoginFail = (message) => {
    notify(message);
  };

  return (
    <div>
      <nav className="navbar">
        <ul className="navbar-nav">
          <li className="nav-item">
            <span className="nav-link">Home</span>
          </li>
        </ul>
        <ul className="navbar-nav right">
          <li className="nav-item">
            <span className="nav-link" onClick={openModal}>
              Login
            </span>
          </li>
          <li className="nav-item">
            <span className="nav-link">Register</span>
          </li>
        </ul>
      </nav>
      <CustomModal
        isOpen={isOpen}
        closeModal={closeModal}
        onLoginSuccess={handleLoginSuccess}
        onLoginFail={handleLoginFail}
      />
      <ToastContainer />
    </div>
  );
}

export default Home;
