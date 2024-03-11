import "./App.css";
import React from "react";
// import { Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Exhibitions from "./pages/Exhibitions";
import Collections from "./pages/Collections";
import Shop from "./pages/Shop";
import Login from "./pages/Login";

function App() {
  return (
    <div className="bg-ivory min-h-screen">
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/About" element={<About />}></Route>
            <Route path="/Exhibitions" element={<Exhibitions />}></Route>
            <Route path="/Collections" element={<Collections />}></Route>
            <Route path="/Shop" element={<Shop />}></Route>
            <Route path="/Login" element={<Login />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
