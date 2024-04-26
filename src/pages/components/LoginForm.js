import "./LoginForm.css";
import React, { useState } from "react";
import axios from "axios";

const API_URL =
  "https://vmt-api-practice.azurewebsites.net/api/Authentication/login";

function LoginForm({ onLoginSuccess, onLoginFail }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false); // State for tracking loading

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(API_URL, {
        email: username,
        password: password,
      });

      if (response.data.isSuccess) {
        localStorage.setItem("token", response.data.data.accessToken);
        onLoginSuccess();
      } else {
        onLoginFail(response.data.messages[0].content);
      }
    } catch (error) {
      onLoginFail(error.response.statusText);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-modal">
      {" "}
      {/* Apply CSS class to the containing div */}
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Email"
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <div className="remember-forgot">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          <span>Forgot password</span>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={loading ? "login-button-disabled" : "login-button"}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
