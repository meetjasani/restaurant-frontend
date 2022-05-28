import { ApiGet } from "../../helper/API/ApiData";
import {
  REMOVE_USER_DATA,
  USER_DATA,
  USER_DATA_ERR,
} from "../types";

export const getUserData = () => (dispatch) => {
  ApiGet("user/getuser")
    .then((res) => {
      let data = {
        user_id: res._id,
        name: res.name,
        mobileNumber: res.mobileNumber,
        role_id: res.roleId._id,
        role_name: res.roleId.name,
        username: res.username,
        rights: res.roleId.rights,
        license: res.licenseId
      }
      dispatch({
        type: USER_DATA,
        payload: data,
      });
    })
    .catch((error) => {
      dispatch({
        type: REMOVE_USER_DATA
      })
      dispatch({
        type: USER_DATA_ERR,
        payload: error.message,
      });
    });
};

export const removeUserData = () => (dispatch) => {
  dispatch({
    type: REMOVE_USER_DATA,
  });
};
