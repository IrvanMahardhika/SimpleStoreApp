import axios from "axios";

export const getCartLogin = (cart) => {
    for (let i = 0; i < cart.length; i++) {
        axios.get("http://localhost:5555/prod/getproductdetail", {
            params: {
                productId: cart[i].productId
            }
        })
            .then(res => {
                cart[i].inventory = res.data[0].inventory
                localStorage.setItem(
                    "cartLogin",
                    JSON.stringify(cart)
                )
            })
            .catch()
    }
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

export const emptyCart = (cart) => {
    localStorage.removeItem(cart);
    return {
        type: "EMPTY_CART"
    }
}

export const getCartNonLogin = (cart) => {
    for (let i = 0; i < cart.length; i++) {
        axios.get("http://localhost:5555/prod/getproductdetail", {
            params: {
                productId: cart[i].productId
            }
        })
            .then(res => {
                cart[i].inventory = res.data[0].inventory
                localStorage.setItem(
                    "cart",
                    JSON.stringify(cart)
                )
            })
            .catch()
    }
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