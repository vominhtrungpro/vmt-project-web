import "./MyProfile.css";
import Modal from "react-modal";
import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link, Element } from "react-scroll";
import { SocialIcon } from "react-social-icons";

Modal.setAppElement("#root");

const CustomModal = ({ isOpen, data, closeModal }) => {
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
      contentLabel="Modal"
      style={customStyles}
      onRequestClose={closeModal}
    >
      <div dangerouslySetInnerHTML={{ __html: data }} />
    </Modal>
  );
};

function MyProfile() {
  const [aboutMeData, setAboutMeData] = useState([]);
  const [myCareerData, setMyCareerData] = useState([]);
  const [myProjectData, setMyProjectData] = useState([]);
  const [myContactData, setMyContacttData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const openModal = (content) => {
    setIsOpenModal(true);
    setModalContent(content);
  };

  const closeModal = () => {
    setIsOpenModal(false);
    setModalContent("");
  };

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
        const profileData = response.data.data;

        profileData.forEach((item) => {
          switch (item.slug) {
            case "about-me":
              setAboutMeData((prevData) => [...prevData, item]);
              break;
            case "my-career":
              setMyCareerData((prevData) => [...prevData, item]);
              break;
            case "my-project":
              setMyProjectData((prevData) => [...prevData, item]);
              break;
            case "my-contact":
              setMyContacttData((prevData) => [...prevData, item]);
              break;
            default:
              break;
          }
        });
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
          <Link to="section2" smooth={true} duration={500}>
            My career
          </Link>
        </div>
        <div>
          <Link to="section3" smooth={true} duration={500}>
            My Project
          </Link>
        </div>
        <div>
          <Link to="section4" smooth={true} duration={500}>
            Contact Me
          </Link>
        </div>
      </div>
      <div className="introduce">
        <h1>Welcome to my site!</h1>
        <span>This is my personal site, hope you enjoy it!</span>
      </div>
      <Element name="section1" className="section">
        {aboutMeData &&
          aboutMeData.map((item, index) => {
            return (
              <div key={index} className="introduce">
                <h1>{item.name}</h1>
                <div dangerouslySetInnerHTML={{ __html: item.content }} />
              </div>
            );
          })}
      </Element>
      <Element name="section2" className="section">
        {myCareerData &&
          myCareerData.map((item, index) => {
            return (
              <div key={index} className="introduce">
                <h1>{item.name}</h1>
                <span>{item.content}</span>
              </div>
            );
          })}
      </Element>
      <Element name="section3" className="section">
        <div className="introduce">
          <h1>My Project</h1>
          <ol>
          {myProjectData &&
            myProjectData.map((item, index) => {
              return (
                <li key={index}>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => openModal(item.content)}
                  >
                    {item.name}
                  </span>
                </li>
              );
            })}
</ol> 

        </div>
      </Element>
      <Element name="section4" className="section">
        <div className="introduce">
          <h1>My Contact</h1>
          <div className="connect-text">
          {myContactData &&
            myContactData.map((item, index) => {
              return (
                <div key={index}>
                  <SocialIcon url={item.content} className="social-icon"/>
                </div>
              );
            })}
          </div>
        </div>
      </Element>
      <CustomModal
        isOpen={isOpenModal}
        data={modalContent}
        closeModal={closeModal}
      />
    </div>
  );
}

export default MyProfile;
