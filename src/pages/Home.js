import "./Home.css";
import Modal from "react-modal";
import React, { useState } from "react";
import LoginForm from "./components/LoginForm";

const CustomModal = ({ isOpen, closeModal,onLoginSuccess  }) => {
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
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </Modal>
  );
};

function Home() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleLoginSuccess = () => {
    // Perform any actions upon successful login
    console.log("Login successful!");
    closeModal(); // Close the modal
  };


  return (
    <div>
      <nav className="navbar">
        <ul className="navbar-nav">
          <li className="nav-item">
            <span className="nav-link">
              Home
            </span>
          </li>
          <li className="nav-item">
            <span className="nav-link">
              About
            </span>
          </li>
          <li className="nav-item">
            <span className="nav-link">
              Services
            </span>
          </li>
          <li className="nav-item">
            <span className="nav-link">
              Contact
            </span>
          </li>
        </ul>
        <ul className="navbar-nav right">
          <li className="nav-item">
            <span className="nav-link" onClick={openModal}>
              Login
            </span>
          </li>
          <li className="nav-item">
            <span className="nav-link">
              Register
            </span>
          </li>
        </ul>
      </nav>
      <CustomModal isOpen={isOpen} closeModal={closeModal} onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}

export default Home;
