import React, { useState } from 'react';
import "./SimplyBlastStep1.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { RotatingLines } from 'react-loader-spinner';



function SimplyBlastStep1({ email, setEmail, password, setPassword, onNext }) {
  const notify = (message) => toast(message);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://app-simplyblast-api-qa-sea.azurewebsites.net/api/auth/login', {
        email,
        password
      });

      if (response.data.isSuccess) {
        onNext(response.data);
      } else {   
        notify('Authentication failed!')
      }
    } catch (error) {
      console.log(error.response.data)
      if(error.response.data.status === 400) {
        notify('Bad request!')
      } else {
        notify(error.response.data.detail)
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="step-content">
      <p>Authenticate with your SimplyBlast account</p>
      <h4>Authentication</h4>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </div>
      <button className="button-no-background" onClick={handleNext}>
        Next
      </button>
      <ToastContainer position="top-center" />
      {loading && (
        <div className="overlay">
        <RotatingLines color="#00BFFF" height={80} width={80} />
      </div>
      )}
    </div>
  );
}

export default SimplyBlastStep1;
