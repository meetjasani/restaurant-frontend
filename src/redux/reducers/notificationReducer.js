import { GET_NOTIFICATION, GET_NOTIFICATION_ERROR } from "../types";

const initialState = {
  notificationData: [],
  notificationDataErr: [],
};

export const notificationDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_NOTIFICATION:
      return {
        ...state,
        notificationData: action.payload,
      };

    case GET_NOTIFICATION_ERROR:
      return {
        ...state,
        notificationDataErr: action.payload,
        notificationData: null,
      };

    default:
      return state;
  }
};
