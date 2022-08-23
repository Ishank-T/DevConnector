import {
    PROFILE_SUCCESS,
    UPDATE_PROFILE,
    PROFILE_ERROR,
    CLEAR_PROFILE,
    GET_PROFILES,
    GET_REPOS
}from '../actions/types';


const initialState={
    profile:null,
    profiles:{},
    repo:[],
    loading:true,
    error:{}
}

function profileReducer(state=initialState,action){
    const {type,payload}=action;

    switch(type){
        case UPDATE_PROFILE:
        case PROFILE_SUCCESS:
            return{
                ...state,
                profile:payload,
                loading:false
            }
        case GET_PROFILES:
            return{
                ...state,
                profiles:payload,
                loading:false
            }
        case PROFILE_ERROR:
            return {
                ...state,
                error:payload,
                loading:false,
                profile:null
            }
        case CLEAR_PROFILE:
            return { 
                ...state,
                profile:null,
                repo:[],
                loading:false
            }
        case GET_REPOS:
            return{
                ...state,
                repo:payload,
                loading:false
            }
        default:
            return state;
    }
}

export default profileReducer;