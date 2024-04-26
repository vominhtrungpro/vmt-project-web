import "./Home.css";
import Modal from "react-modal";
import React, { useState, useEffect } from 'react';
import LoginForm from "./components/LoginForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./components/NavBar";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra nếu có token trong local storage khi component được tạo
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true); // Đã đăng nhập
    }
  }, []);

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
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const handleLoginFail = (message) => {
    notify(message);
  };

  return (
    <div>
      <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} openModal ={openModal}/>
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
