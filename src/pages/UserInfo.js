import "./UserInfo.css";
import Modal from "react-modal";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./components/NavBar";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

Modal.setAppElement("#root");

const API_URL = "https://vmt-api-practice.azurewebsites.net/";

function UserInfo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const navigate = useNavigate();

  const handleChangeAvatar = async (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      try {
        const formData = new FormData();
        formData.append("files", selectedFile);

        const response = await axios.post(
          API_URL + "/api/Upload/upload",
          formData,
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const data = response.data.data;
        if (data) {
          setAvatarUrl(data[0]);
        }
      } catch (error) {
        notify("Error upload image:", error);
      }
    } else {
      navigate("/");
    }
    setIsLoading(false);
  };

  const handleEditInfo = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      setLoadingEdit(true);
      console.log(avatarUrl);
      try {
        const response = await axios.post(
          API_URL + "/api/UserInfo",
          {
            userId: jwtDecode(token).UserId,
            avatarUrl: avatarUrl,
            firstName: firstName,
            lastName: lastName,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data;
        if (data.isSuccess) {
          notify("Success, please login again!");
          setTimeout(handleLogout, 3000); 
        } else {
          notify("Failed: ", data.messages.content);
        }
      } catch (error) {
        notify("Error update profile:", error);
        console.log(error);
      } finally {
        setLoadingEdit(false);
      }
    } else {
      navigate("/");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      console.log(token)
      if (token) {
        setIsLoggedIn(true);
        try {
          const response = await axios.get(
            API_URL + "/api/User/" + jwtDecode(token).UserId,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          console.log(response);
          const data = response.data.data;
          if (data) {
            setUserInfo(data);
            if (!data.userInfo) {
              notify("Info not found, please update!");
              setFirstName("");
              setLastName("");
              setAvatarUrl("");
            } else {
              setFirstName(data.userInfo.firstName);
              setLastName(data.userInfo.lastName);
              setAvatarUrl(data.userInfo.avatarUrl);
            }
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            navigate("/chat");
          } else {
            notify("Error getting user info:", error);
          }    
        }
      } else {
        navigate("/");
      }
    };

    fetchUserInfo();

    return () => {};
  }, [navigate]);

  const notify = (message) => toast(message);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/chat");
  };

  return (
    <div>
      <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <div className="user-info-container">
        <h2>User Information</h2>
        {userInfo ? (
          <div className="container">
            <div className="avatar-container">
              {isLoading ? (
                <label htmlFor="avatarInput">
                  <img
                    src={
                      "https://vmtprojectstorage.blob.core.windows.net/image-blobs/240429_094835443_loading.gif"
                    }
                    className="avatar"
                    alt="User Avatar"
                  />
                </label>
              ) : (
                <label htmlFor="avatarInput">
                  <img src={avatarUrl} className="avatar" alt="User Avatar" />
                </label>
              )}
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                onChange={handleChangeAvatar}
                style={{ display: "none" }}
              />
            </div>
            <div className="user-details">
              <div>
                <form onSubmit={handleEditInfo}>
                  <div>
                    <label className="user-name-label">User Name: </label>
                    <span className="user-name-span">{userInfo.userName}</span>
                  </div>
                  <div>
                    <label>First Name: </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Your name.."
                    />
                  </div>
                  <div>
                    <label>Last Name: </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Your name.."
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={loadingEdit}
                      className={
                        loadingEdit ? "login-button-disabled" : "login-button"
                      }
                    >
                      {loadingEdit ? "Editing in..." : "Edit"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}

export default UserInfo;
