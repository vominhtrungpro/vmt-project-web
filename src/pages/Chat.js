import "./Chat.css";
import Modal from "react-modal";
import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import { useNavigate } from "react-router-dom";
import ChatForm from "./components/ChatForm";
import * as signalR from "@microsoft/signalr";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

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

function Chat() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [connection, setConnection] = useState(null);
  const [userName, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

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


  const callElainaAI = async (message) => {
    try {
      const response = await fetch(
        "https://vmt-api-assistant.azurewebsites.net/api/run",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            thread_id: "thread_zFqdLrW8sqMXkWu3zPHe0ACh",
            message: message,
          }),
        }
      );
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let messageContent = '';

      while (true) {
        const { done, value } = await reader.read();

        
        if (done) {
          const newMessage = { content: messageContent, username: 'Elaina AI', avatarUrl: '' };
          if (connection) {
            connection
              .invoke("SendMessage", newMessage)
              .catch((err) => console.error("Error sending message: ", err));
          }

          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const parts = chunk.split('\n\n');
        for (const part of parts) {
          if (part.trim() !== '') {
            const cleanedMessage = part.replace('data: ', '');
            messageContent += cleanedMessage
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const sendMessage = (m) => {
    if (!isLoggedIn) {
      notify("Login to use this!");
      return;
    }
    if (m.includes("@Elaina")) { 
      const newMessage = { content: m, username: userName, avatarUrl: avatarUrl };
      if (connection) {
        connection
          .invoke("SendMessage", newMessage)
          .catch((err) => console.error("Error sending message: ", err));
      }
      callElainaAI(m);
      return;
    }
    const newMessage = { content: m, username: userName, avatarUrl: avatarUrl };
    if (connection) {
      connection
        .invoke("SendMessage", newMessage)
        .catch((err) => console.error("Error sending message: ", err));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setAvatarUrl(decoded.AvatarUrl);
      setUsername(decoded.UserName);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://vmt-api-practice.azurewebsites.net/message")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    const handleMessage = (data) => {
      setMessages((prevMessages) => {
        if (
          prevMessages.length > 0 &&
          prevMessages[prevMessages.length - 1].name === data.username
        ) {
          return [
            ...prevMessages.slice(0, -1),
            {
              ...prevMessages[prevMessages.length - 1],
              content: [
                ...prevMessages[prevMessages.length - 1].content,
                data.content,
              ],
            },
          ];
        } else {
          return [
            ...prevMessages,
            {
              content: [data.content],
              name: data.username,
              avatar: data.avatarUrl,
            },
          ];
        }
      });
    };

    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected to SignalR hub");
        })
        .catch((err) => console.error("SignalR connection error: ", err));

      connection.on("ReceiveMessage", handleMessage);

      return () => {
        connection.off("ReceiveMessage");
        connection.stop();
      };
    }
  }, [connection]);

  return (
    <div>
      <NavBar
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        openModalLogin={openModalLogin}
        openModalRegister={openModalRegister}
      />
      <div className="chat-container">
        <h2>Chat</h2>
        <div>
          <div className="message-list">
            {messages.map((msg, index) => (
              <div className="message" key={index}>
                <img className="user-img" src={msg.avatar} alt="sender" />
                <div className="message-text">
                  <span className="message-username">{msg.name}</span>
                  {/* Check if msg.content is an array */}
                  {Array.isArray(msg.content) ? (
                    // If it's an array, map over it to render each string separately
                    msg.content.map((content, index) => (
                      <span className="message-content" key={index}>
                        {content}
                      </span>
                    ))
                  ) : (
                    // If it's a string, render it directly
                    <span className="message-content">{msg.content}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="chat-form-container">
            <ChatForm sendMessage={sendMessage} />
          </div>
        </div>
      </div>
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
    </div>
  );
}

export default Chat;
