import { CHANGE_LICENSE_STATE } from '../types';

const initialState = {
    is_licensein: false,
};

export const isUserlicenseReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_LICENSE_STATE:
            return {
                ...state,
                is_licensein: action.payload,
            };
        default:
            return state;
    }
};
