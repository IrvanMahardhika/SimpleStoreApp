import {combineReducers} from "redux";

const init = {
    check : false
}

const checkReducer = (state=init,action)=>{
    switch (action.type) {
        case "CHANGE_HEADER":
            return {...state, check : action.payload.check}
        default:
            return state
    }
}

const reducers = combineReducers(
    {
        check : checkReducer
    }
)

export default reducers