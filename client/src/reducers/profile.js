import {
    PROFILE_SUCCESS,
    PROFILE_ERROR,
    CLEAR_PROFILE
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
        case PROFILE_SUCCESS:
            return{
                ...state,
                profile:payload,
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
        default:
            return state;
    }
}

export default profileReducer;