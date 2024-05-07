import "./RegisterForm.css";
import React, { useState } from "react";
import axios from "axios";

const API_URL = "https://vmt-api-practice.azurewebsites.net/";

function RegisterForm({ onRegisterSuccess, onRegisterFail }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(API_URL + "api/Authentication/register", {
        userName: username,
        email: email,
      });

      if (response.data.isSuccess) {
        onRegisterSuccess();
      } else {
        onRegisterFail(response.data.messages[0].content);
      }
    } catch (error) {
        onRegisterFail(error.response.statusText);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="register-modal">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={loading ? "register-button-disabled" : "register-button"}
        >
          {loading ? "Registering in..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
