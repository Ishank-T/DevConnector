import React, { Fragment } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from './components/layout/Alert';
//Redux
import { Provider } from "react-redux";
import store from "./store";

const App = () => {
  return (
    <div>
      <Provider store={store}>
        <Router>
          <Navbar />
          <Alert/>
          
          <Routes>
            <Route path="/" element={<Landing />} />
            
            <Route
              path="/login"
              element={
                <section className="container">
                  <Login />
                </section>
              }
            />
            <Route
              path="/register"
              element={
                <section className="container">
                  <Register />
                </section>
              }
            />
          </Routes>
        </Router>
      </Provider>
    </div>
  );
};

export default App;
