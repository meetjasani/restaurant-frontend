import { CHANGE_LOGIN_STATE } from '../types'

export const changeLoginState = (value) => (dispatch) => {
    dispatch({
        type: CHANGE_LOGIN_STATE,
        payload: value,
    })

}
