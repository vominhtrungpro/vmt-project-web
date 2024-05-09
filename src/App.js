import "./App.css";
import Home from "./pages/Home";
import UserInfo from "./pages/UserInfo";
import Chat from "./pages/Chat"
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user-info" element={<UserInfo />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
