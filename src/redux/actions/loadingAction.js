import { IS_LOADING } from '../types';

export const setIsLoading = (value) => (dispatch) => {
    dispatch({
        type: IS_LOADING,
        payload: value,
    });
};