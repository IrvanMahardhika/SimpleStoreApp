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

export const emptyCart = ()=>{
    localStorage.removeItem("cart");
    alert("your cart is empty")
    return {
        type : "EMPTY_CART"
    }
}