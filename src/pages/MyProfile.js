import "./MyProfile.css";
import Modal from "react-modal";
import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./components/NavBar";
import { useNavigate } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import axios from "axios";

Modal.setAppElement("#root");

const CustomModalLogin = ({
  isOpen,
  closeModal,
  onLoginSuccess,
  onLoginFail,
}) => {
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

const CustomModalRegister = ({
  isOpen,
  closeModal,
  onRegisterSuccess,
  onRegisterFail,
}) => {
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
      <RegisterForm
        onRegisterSuccess={onRegisterSuccess}
        onRegisterFail={onRegisterFail}
      />
    </Modal>
  );
};

function MyProfile() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://vmt-api-practice.azurewebsites.net/api/MyProfile",
          {
            headers: {
              accept: "*/*",
            },
          }
        );
        setProfileData(response.data.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
    return () => {};
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
      <NavBar
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        openModalLogin={openModalLogin}
        openModalRegister={openModalRegister}
      />
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
      <ToastContainer position="top-center" />
      <div className="center-div">
        <div>About me</div>
        <div>My career</div>
        <div>My project</div>
      </div>
      <div className="introduce">
        <h1>Welcome to my site!</h1>
        <span>This is my personal site, hope you enjoy it!</span>
      </div>
      {profileData &&
        profileData.map((profile, index) => {
          if (profile.slug === "about-me") {
            return (
              <div key={index} className="introduce">
                <h1>{profile.name}</h1>
                <span>{profile.content}</span>
              </div>
            )
          }
          if (profile.slug === "my-career") {
            return (
              <div key={index} className="introduce">
                <h1>{profile.name}</h1>
                <span>{profile.content}</span>
              </div>
            )
          }
          if (profile.slug === "my-project") {
            return (
              <div key={index} className="introduce">
                <h1 dangerouslySetInnerHTML={{ __html: profile.name }} />
                <div dangerouslySetInnerHTML={{ __html: profile.content }} />
              </div>
            )
          }
          return null;
        })}
    </div>
  )
}

export default MyProfile;
