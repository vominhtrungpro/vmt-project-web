import "./Chat.css";
import Modal from "react-modal";
import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import { useNavigate } from "react-router-dom";
import ChatForm from "./components/ChatForm";
import * as signalR from "@microsoft/signalr";

Modal.setAppElement("#root");

function Chat() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [connection, setConnection] = useState(null);

  const sendMessage = (m) => {
    const newMessage = { content: m, username: 'test', avatarUrl: 'url' };

    console.log("Sending message:", newMessage);
    if (connection) {
      connection
        .invoke("SendMessage", newMessage)
        .catch((err) => console.error("Error sending message: ", err));
    }

    setMessages([...messages, { content: m, sender: "me" }]);
  };

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://vmt-api-practice.azurewebsites.net/message", {
        transport: signalR.HttpTransportType.WebSockets, // Sử dụng giao thức WebSocket
        skipNegotiation: true,
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      // Bắt đầu kết nối
      connection
        .start()
        .then(() => {
          console.log("Connected to SignalR hub");
        })
        .catch((err) => console.error("SignalR connection error: ", err));

      // Lắng nghe các sự kiện từ hub
      connection.on("ReceiveMessage", (data) => {
        console.log("Received data from SignalR:", data);
        // Xử lý dữ liệu nhận được ở đây
      });

      // Cleanup khi component unmount
      return () => {
        connection.off("YOUR_EVENT_NAME");
        connection.stop();
      };
    }
  }, [connection]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div>
      <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <div className="chat-container">
        <h2>Chat</h2>
        <div>
          <div className="message-list">
            {messages.map((msg, index) => (
              <div key={index}>
                <span>{msg.sender}: </span>
                <span>{msg.content}</span>
              </div>
            ))}
          </div>
          <div className="chat-form-container">
            <ChatForm sendMessage={sendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
