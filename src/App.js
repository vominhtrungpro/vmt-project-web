import "./App.css";
import UserInfo from "./pages/UserInfo";
import Chat from "./pages/Chat"
import MyProfile from "./pages/MyProfile";
import SimplyBlast from "./pages/SimplyBlast";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MyProfile />} />
        <Route path="/user-info" element={<UserInfo />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/simply-blast" element={<SimplyBlast />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
