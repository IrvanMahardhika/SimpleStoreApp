import { combineReducers } from "redux";

const init = {
    check: false,
    register: "",
    location: [],
    user: [],
    cart: [],
    cartQty: 0,
    home: false
}

const checkReducer = (state = init, action) => {
    switch (action.type) {
        case "CHANGE_HEADER":
            return { ...state, check: true }
        case "HEADER_SEARCH_BOX":
            return { ...state, check: false }
        default:
            return state
    }
}

const loginReducer = (state = init, action) => {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return { ...state, user: action.payload }
        case "LOGOUT_SUCCESS":
            return { ...state, user: [] }
        default:
            return state
    }
}

const registerReducer = (state = init, action) => {
    switch (action.type) {
        case "REGISTER_SUCCESS":
            return { ...state, register: "success" }
        default:
            return state
    }
}

const locationReducer = (state = init, action) => {
    switch (action.type) {
        case "GET_LOCATION_SUCCESS":
            return { ...state, location: action.payload }
        default:
            return state
    }
}

const cartReducer = (state = init, action) => {
    switch (action.type) {
        case "GET_CART":
            return { ...state, cart: action.payload.cart, cartQty: action.payload.cartQty }
        case "EMPTY_CART":
            return { ...state, cart: [], cartQty: 0 }
        default:
            return state
    }
}

const homeReducer = (state = init, action) => {
    switch (action.type) {
        case "HOME":
            return { ...state, home: true }
        default:
            return state
    }
}

const reducers = combineReducers(
    {
        check: checkReducer,
        login: loginReducer,
        register: registerReducer,
        location: locationReducer,
        cart: cartReducer,
        home: homeReducer
    }
)

export default reducers