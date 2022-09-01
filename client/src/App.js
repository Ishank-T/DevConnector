import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from './components/layout/Alert';
import setAuthToken from './utils/setAuthToken';
import {loadUser} from './actions/auth';
import Profiles from "./components/profiles/Profiles";
import Profile from './components/profile/Profile';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from "./components/routing/PrivateRoute";
import ProfileForm from "./components/profile-forms/ProfileForm";
import AddExperience from "./components/profile-forms/AddExperience";
import AddEducation from "./components/profile-forms/AddEducation";
import  Posts from "./components/posts/Posts";
import Post from "./components/post/Post";
//Redux
import { Provider } from "react-redux";
import store from "./store";


const App = () => {
  
  useEffect(()=>{
    if(localStorage.token){
      setAuthToken(localStorage.token);
    }
      store.dispatch(loadUser());
  },[]);

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
             <Route
              path="/profiles"
              element={
                <section className="container">
                  <Profiles/>
                </section>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <section className="container">
                  <Profile/>
                </section>
              }
            />
            <Route
              path="/dashboard"
              element={
                <section className="container">
                  <PrivateRoute component={Dashboard}/>
                </section>

              }
            />
            <Route
              path="/create-profile"
              element={
                <section className="container">
                  <PrivateRoute component={ProfileForm}/>
                </section>

              }
            />
            <Route
              path="/edit-profile"
              element={
                <section className="container">
                  <PrivateRoute component={ProfileForm}/>
                </section>

              }
            />
             <Route
              path="/add-experience"
              element={
                <section className="container">
                  <PrivateRoute component={AddExperience}/>
                </section>

              }
            />
             <Route
              path="/add-education"
              element={
                <section className="container">
                  <PrivateRoute component={AddEducation}/>
                </section>

              }
            />
             <Route
              path="/posts"
              element={
                <section className="container">
                  <PrivateRoute component={Posts}/>
                </section>

              }
            />
            <Route
              path="/posts/:id"
              element={
                <section className="container">
                  <PrivateRoute component={Post}/>
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
