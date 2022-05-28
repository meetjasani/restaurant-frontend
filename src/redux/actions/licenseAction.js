import { CHANGE_LICENSE_STATE } from '../types'

export const changeLicenseState = (value) => (dispatch) => {
    dispatch({
        type: CHANGE_LICENSE_STATE,
        payload: value,
    })

}