import "./MyProfile.css";
import Modal from "react-modal";
import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link, Element } from "react-scroll";

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
        <div>
          <Link to="section1" smooth={true} duration={500}>
            About Me
          </Link>
        </div>
        <div>
          {" "}
          <Link to="section2" smooth={true} duration={500}>
            My career
          </Link>
        </div>
        <div>
          {" "}
          <Link to="section3" smooth={true} duration={500}>
            My Project
          </Link>
        </div>
      </div>
      <div className="introduce">
        <h1>Welcome to my site!</h1>
        <span>This is my personal site, hope you enjoy it!</span>
      </div>
      {profileData &&
        profileData.map((profile, index) => {
          if (profile.slug === "about-me") {
            return (
              <Element name="section1" className="section">
                <div key={index} className="introduce">
                  <h1>{profile.name}</h1>
                  <span>{profile.content}</span>
                </div>
              </Element>
            );
          }
          if (profile.slug === "my-career") {
            return (
              <Element name="section2" className="section">
                <div key={index} className="introduce">
                  <h1>{profile.name}</h1>
                  <span>{profile.content}</span>
                </div>
              </Element>
            );
          }
          if (profile.slug === "my-project") {
            return (
              <Element name="section3" className="section">
                <div key={index} className="introduce">
                  <h1 dangerouslySetInnerHTML={{ __html: profile.name }} />
                  <div dangerouslySetInnerHTML={{ __html: profile.content }} />
                </div>
              </Element>
            );
          }
          return null;
        })}
    </div>
  );
}

export default MyProfile;
