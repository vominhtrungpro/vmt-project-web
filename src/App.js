import "./App.css";
import Home from "./pages/Home";
import UserInfo from "./pages/UserInfo";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user-info" element={<UserInfo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
