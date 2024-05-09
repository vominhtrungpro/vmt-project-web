import React, { useState } from "react";

const ChatForm = ({ sendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex" }}>
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ marginRight: "8px" }}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default ChatForm;
