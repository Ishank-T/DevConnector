import axios from 'axios';
// import {connect} from 'react-redux';
import {setAlert} from './alert';

import{
    PROFILE_SUCCESS,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    CLEAR_PROFILE,
    ACCOUNT_DELETED,
    GET_PROFILES,
    GET_REPOS
}from './types';


export const getCurrentProfile= () => async dispatch=>{
    try {
        const res = await axios.get('/api/profile/me');

        dispatch({
            type:PROFILE_SUCCESS,
            payload:res.data
        });
        
    } catch (err) {
       dispatch({
            type:PROFILE_ERROR,
            payload: {msg:err.response.statusText, status:err.response.status}
       })
    }
}

// get all profiles

export const getProfiles= () => async dispatch=>{
  dispatch({type:CLEAR_PROFILE});
  try {
      const res = await axios.get('/api/profile');
      dispatch({
          type:GET_PROFILES,
          payload:res.data
      });
      
  } catch (err) {
     dispatch({
          type:PROFILE_ERROR,
          payload: {msg:err.response.statusText, status:err.response.status}
     })
  }
}
// get profile by user id

export const getProfileById= (userId) => async dispatch=>{
  try {
      const res = await axios.get(`/api/profile/user/${userId}`);
      dispatch({
          type:PROFILE_SUCCESS,
          payload:res.data
      });
      
  } catch (err) {
     dispatch({
          type:PROFILE_ERROR,
          payload: {msg:err.response.statusText, status:err.response.status}
     })
  }
}

// get github repos of user

export const getGithubRepos= (username) => async dispatch=>{
  try {
      const res = await axios.get(`/api/profile/github/${username}`);
      dispatch({
          type:GET_REPOS,
          payload:res.data
      });
      
  } catch (err) {
     dispatch({
          type:PROFILE_ERROR,
          payload: {msg:err.response.statusText, status:err.response.status}
     })
  }
}

export const createProfile = (formData,navigate,edit= false)=> async (dispatch)=>{
    try {
        const res = await axios.post('/api/profile',formData);

        dispatch({
            type:PROFILE_SUCCESS,
            payload:res.data
        });
        dispatch(
            setAlert(edit? 'Profile updated successfully':'Profile created successfully','success')
        );
        if (!edit) {
            navigate('/dashboard');
          }
    } catch (err) {
        const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
}

//Add experience

export const addExperience = (formData,navigate)=>async dispatch=>{
    try {
        const res = await axios.put('/api/profile/experience',formData);

        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        });
        dispatch(
            setAlert('Education Added','success')
        );
        navigate('/dashboard');

    } catch (err) {
        const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
}

//Add education

export const addEducation = (formData,navigate)=>async dispatch=>{
    try {
        const res = await axios.put('/api/profile/education',formData);

        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        });
        dispatch(
            setAlert('Experience Added','success')
        );
        navigate('/dashboard');

    } catch (err) {
        const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
}

//Delete experience
export const deleteExperience = (id) => async dispatch =>{
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);

    dispatch({
      type:UPDATE_PROFILE,
      payload:res.data
    });
    dispatch(
      setAlert('Experience removed','success')
    );

  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

//Delete education
export const deleteEducation = (id) => async dispatch =>{
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);

    dispatch({
      type:UPDATE_PROFILE,
      payload:res.data
    });
    dispatch(
      setAlert('Education removed','success')
    );

  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

//Delete account
export const deleteAccount = () => async dispatch =>{
  if(
    window.confirm('Are you sure? This cannot be undone!')
  ){
    try {
      await axios.delete('/api/profile');
  
      dispatch({type:CLEAR_PROFILE,});
      dispatch({type:ACCOUNT_DELETED});
      dispatch(
        setAlert('Your account has been permanantly deleted')
      );
  
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
}