import axios from "axios";

export const keepCart = (cart) => {
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

export const getCartLogin = () => {
    let storage = JSON.parse(localStorage.getItem("userData"))
    let token = localStorage.getItem("token")
    return (dispatch) => {
        axios.get("http://localhost:5555/tran/getcart", {
            params: {
                userId: storage[0].userId
            },
            headers: {
                authorization: token
            }
        })
            .then(res => {
                console.log(res.data);
                
                localStorage.setItem(
                    "cartLogin",
                    JSON.stringify(res.data)
                )
                let z = 0
                for (let i = 0; i < res.data.length; i++) {
                    z += parseInt(res.data[i].qty)
                }
                dispatch(
                    {
                        type: "GET_CART",
                        payload: {
                            cart: res.data,
                            cartQty: z
                        }
                    }
                )
            })
            .catch()
    }
}

export const getCartNonLogin = () => {
    let localUser = localStorage.getItem("localUser")
    return (dispatch) => {
        axios.get("http://localhost:5555/tran/getcartnonlogin", {
            params: {
                userId: localUser
            }
        })
            .then(res => {
                localStorage.setItem(
                    "cart",
                    JSON.stringify(res.data)
                )
                let z = 0
                for (let i = 0; i < res.data.length; i++) {
                    z += parseInt(res.data[i].qty)
                }
                dispatch(
                    {
                        type: "GET_CART",
                        payload: {
                            cart: res.data,
                            cartQty: z
                        }
                    }
                )
            })
            .catch()
    }
}

export const emptyCart = (cart) => {
    localStorage.removeItem(cart);
    return {
        type: "EMPTY_CART"
    }
}