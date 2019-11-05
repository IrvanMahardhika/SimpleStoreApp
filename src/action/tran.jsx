import axios from "axios";

export const getCart = (cart) => {
    let z = 0
    for (let i = 0; i < cart.length; i++) {
        z += parseInt(cart[i].qty) 
    }
    return {
        type: "GET_CART",
        payload: {
            cart: cart,
            cartQty: z
        }
    }
}

export const emptyCart = (cart)=>{
    localStorage.removeItem(cart);
    return {
        type : "EMPTY_CART"
    }
}