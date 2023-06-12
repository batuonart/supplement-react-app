import { loginFailure, loginStart, loginSuccess, logoutSuccess, registerStart, registerSuccess, registerFailure } from "./userRedux";
import { publicRequest } from "../requestMethod";
import axios from 'axios';

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", user);
    console.log( res.data )
    dispatch(loginSuccess(res.data));
  } catch (err) {
    console.log( err )
    dispatch(loginFailure());
  }
};

export const register = async (dispatch, user) => {
  dispatch(registerStart());
  try {
    const res = await publicRequest.post("/auth/register", user);
    console.log( res.data )
    dispatch(registerSuccess(res.data));
  } catch (err) {
    console.log( err )
    dispatch(registerFailure());
  }
};

export const logout = async(dispatch) => {
  try {
    dispatch(logoutSuccess());
  } catch (error) {
    console.log("Error while logging out!!!");
  }
}


export const addToWishlistApi = async (userId, itemId) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/users/addwishlist/${itemId}`
    );
    console.log('RESPONSE: ', response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
