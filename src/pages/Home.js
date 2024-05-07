import "./Home.css";
import Modal from "react-modal";
import React, { useState, useEffect } from 'react';
import LoginForm from "./components/LoginForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./components/NavBar";
import { useNavigate } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";

Modal.setAppElement('#root'); 

const CustomModalLogin = ({ isOpen, closeModal, onLoginSuccess, onLoginFail }) => {
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

const CustomModalRegister = ({ isOpen, closeModal, onRegisterSuccess, onRegisterFail }) => {
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
      <RegisterForm onRegisterSuccess={onRegisterSuccess} onRegisterFail={onRegisterFail} />
    </Modal>
  );
};

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const notify = (message) => toast(message);

  const [isOpenModalLogin, setIsOpenModalLogin] = useState(false);
  const [isOpenModalRegister, setIsOpenModalRegister] = useState(false);

  const openModalLogin = () => {
    setIsOpenModalLogin(true);
  };

  const openModalRegister = () => {
    setIsOpenModalRegister(true);
  };

  const closeModalLogin = () => {
    setIsOpenModalLogin(false);
  };

  const closeModalRegister = () => {
    setIsOpenModalRegister(false);
  };

  const handleLoginSuccess = () => {
    notify("Login success!");
    closeModalLogin();
    setIsLoggedIn(true);
  };

  const handleRegisterSuccess = () => {
    notify("Register success, Check your mail for password please!");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleLoginFail = (message) => {
    notify(message);
  };

  const handleRegisterFail = (message) => {
    notify(message);
  };

  return (
    <div>
      <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} openModalLogin ={openModalLogin} openModalRegister={openModalRegister}/>
      <CustomModalLogin
        isOpen={isOpenModalLogin}
        closeModal={closeModalLogin}
        onLoginSuccess={handleLoginSuccess}
        onLoginFail={handleLoginFail}
      />
      <CustomModalRegister
        isOpen={isOpenModalRegister}
        closeModal={closeModalRegister}
        onRegisterSuccess={handleRegisterSuccess}
        onRegisterFail={handleRegisterFail}
      />
      <ToastContainer position="top-center"/>
    </div>
  );
}

export default Home;
