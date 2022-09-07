import { DISPLAY_ALERT, CLEAR_ALERT } from "./actions"


const reducer = (state, action) => {
    if (action.type === DISPLAY_ALERT){
        return {
            ...state,
            showAlert: true,
            alertType: "danger",
            alertText:"Please fill every field",
        }
    }
    if (action.type === CLEAR_ALERT){
        return {
            ...state,
            showAlert: false,
            alertType: "",
            alertText:"",
        }
    }
    throw new Error(`Action "${action.type}" does no exist.`)
}

export default reducer