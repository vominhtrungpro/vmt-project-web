import "./MyProfile.css";
import Modal from "react-modal";
import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

Modal.setAppElement("#root");

function MyProfile() {
  const [profileData, setProfileData] = useState(null);

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

  return (
    <div>
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
