import axios from 'axios';
// import {connect} from 'react-redux';
import {setAlert} from './alert';

import{
    PROFILE_SUCCESS,
    PROFILE_ERROR,
    UPDATE_PROFILE
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