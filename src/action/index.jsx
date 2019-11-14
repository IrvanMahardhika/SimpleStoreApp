import axios from "axios";

export const headerChange = () => {
    return {
        type: "CHANGE_HEADER"
    }
}

export const headerSearchbox = () => {
    return {
        type: "HEADER_SEARCH_BOX"
    }
}

export const login = (keyword, password, rememberMe) => {
    return (dispatch) => {
        axios.get("http://localhost:5555/auth/getlogin", {
            params: {
                username: keyword,
                email: keyword,
                cellphone: keyword,
                password: password
            }
        })
            .then(res => {
                let z = ""
                if (res.data.length === 0) {
                    alert("User not found")
                } else if (res.data.length > 0 && rememberMe === true) {
                    z = res.data[0].userId
                    alert("Login success.");
                    localStorage.setItem(
                        "userData",
                        JSON.stringify(res.data)
                    );
                    localStorage.setItem(
                        "rememberMe",
                        JSON.stringify(res.data[0].username)
                    );
                    dispatch(
                        {
                            type: "LOGIN_SUCCESS",
                            payload: res.data
                        }
                    )
                } else if (res.data.length > 0 && rememberMe === false) {
                    z = res.data[0].userId
                    alert("Login Success.");
                    localStorage.setItem(
                        "userData",
                        JSON.stringify(res.data)
                    );
                    localStorage.removeItem("rememberMe");
                    dispatch(
                        {
                            type: "LOGIN_SUCCESS",
                            payload: res.data
                        }
                    )
                }
                axios.post("http://localhost:5555/auth/gettoken", {
                    username: res.data[0].username
                })
                    .then(pos => {
                        localStorage.setItem("token", pos.data.token);
                        axios.get("http://localhost:5555/tran/getcart", {
                            params: {
                                userId: z
                            },
                            headers: {
                                authorization: pos.data.token
                            }
                        })
                            .then(nex => {
                                if (nex.data.length > 0) {
                                    localStorage.setItem(
                                        "cartLogin",
                                        JSON.stringify(nex.data)
                                    )
                                    let z = 0
                                    for (let i = 0; i < nex.data.length; i++) {
                                        z += parseInt(nex.data[i].qty)
                                    }
                                    dispatch(
                                        {
                                            type: "GET_CART",
                                            payload: {
                                                cart: nex.data,
                                                cartQty: z
                                            }
                                        }
                                    )
                                } else {
                                    dispatch(
                                        {
                                            type: "EMPTY_CART"
                                        }
                                    )
                                }
                            })
                            .catch()
                        
                        if (res.data[0].storeapproval === 1) {
                            axios.get("http://localhost:5555/tran/getuserorder", {
                                params: {
                                    storename: res.data[0].storename
                                },
                                headers: {
                                    authorization: pos.data.token
                                }
                            })
                                .then(nex => {
                                    if (nex.data.length > 0) {
                                        localStorage.setItem(
                                            "userOrder",
                                            JSON.stringify(nex.data)
                                        )
                                        let z = 0
                                        for (let i = 0; i < nex.data.length; i++) {
                                            z += nex.data[i].qty
                                        }
                                        dispatch(
                                            {
                                                type: "GET_USER_ORDER",
                                                payload: {
                                                    userOrder: nex.data,
                                                    userOrderQty: z
                                                }
                                            }
                                        )
                                    }
                                })
                                .catch()
                        }
                    })
                    .catch()
                dispatch(
                    {
                        type: "HOME"
                    }
                )
            })
            .catch()
    }
}

export const keepLogin = (val) => {
    return {
        type: "LOGIN_SUCCESS",
        payload: val
    }
}

export const logout = () => {
    return (dispatch) => {
        localStorage.removeItem("userOrder");
        localStorage.removeItem("userData");
        localStorage.removeItem("token");
        localStorage.removeItem("setproductId");
        localStorage.removeItem("cartLogin");
        dispatch(
            {
                type: "LOGOUT_SUCCESS"
            }
        )
        dispatch(
            {
                type: "EMPTY_CART"
            }
        )
        dispatch(
            {
                type: "EMPTY_USER_ORDER"
            }
        )
        alert("Logout Success.");
        let cart = JSON.parse(localStorage.getItem("cart"))
        if (cart) {
            let z = 0
            for (let i = 0; i < cart.length; i++) {
                z += parseInt(cart[i].qty)
            }
            dispatch(
                {
                    type: "GET_CART",
                    payload: {
                        cart: cart,
                        cartQty: z
                    }
                }
            )
        }
        dispatch(
            {
                type: "HOME"
            }
        )
    }
}

export const addUser = (val) => {
    return (dispatch) => {
        axios.get("http://localhost:5555/auth/checkuser", {
            params: {
                username: val.username,
                email: val.email,
                cellphone: val.cellphone
            }
        })
            .then(res => {
                if (res.data.length > 0) {
                    switch (true) {
                        case res.data[0].username.toLowerCase() === val.username.toLowerCase():
                            alert("That username has been taken.")
                            break
                        case res.data[0].email.toLowerCase() === val.email.toLowerCase():
                            alert("That email has been used.")
                            break
                        case res.data[0].cellphone === val.cellphone:
                            alert("That cellphone number has been registered.")
                            break
                        default:
                            break
                    }
                } else {
                    axios.post("http://localhost:5555/auth/addUser",
                        {
                            fullname: val.fullname,
                            cellphone: val.cellphone,
                            email: val.email,
                            gender: val.gender,
                            username: val.username,
                            password: val.retype_password
                        }
                    )
                        .then(res => {
                            alert("Register success.\nPlease verify your email, by clicking the link we have sent.");
                            axios.get("http://localhost:5555/mail/sendverifyemail", {
                                params: {
                                    email: val.email,
                                    gender: val.gender,
                                    fullname: val.fullname,
                                    username: val.username
                                }
                            }).then().catch();
                            dispatch(
                                {
                                    type: "REGISTER_SUCCESS"
                                }
                            )
                        })
                        .catch()
                }
            })
            .catch()
    }
}

export const sendLinkChangePasswordEmail = (val) => {
    return (dispatch) => {
        axios.get("http://localhost:5555/auth/getuserbyemail", {
            params: {
                email: val
            }
        })
            .then(res => {
                if (res.data.length === 0) {
                    alert("E-mail not found")
                } else {
                    alert("A link to reset you password, has been sent to your email.");
                    axios.get("http://localhost:5555/mail/sendlinkchangepasswordemail", {
                        params: {
                            email: res.data[0].email,
                            gender: res.data[0].gender,
                            fullname: res.data[0].fullname,
                            userId: res.data[0].userId
                        }
                    }).then().catch();
                    dispatch(
                        {
                            type: "REGISTER_SUCCESS"
                        }
                    )
                }
            })
            .catch()
    }
}


export const changePassword = (val) => {
    return (dispatch) => {
        axios.put("http://localhost:5555/auth/changePassword",
            {
                userId: val.userId,
                username: val.username,
                password: val.retype_password
            }
        )
            .then(res => {
                console.log(res.data.changedRows);

                if (res.data.changedRows === 0) {
                    alert("Wrong username")
                } else {
                    alert("Your password has been changed.\nPlease try to login using your new password.");
                    dispatch(
                        {
                            type: "REGISTER_SUCCESS"
                        }
                    )
                }
            })
            .catch()
    }
}

export const sendVerifyEmail = (val) => {
    return (dispatch) => {
        alert("Verification link has been sent to your e-mail.");
        axios.get("http://localhost:5555/mail/sendverifyemail", {
            params: {
                email: val.email,
                gender: val.gender,
                fullname: val.fullname,
                username: val.username
            }
        }).then().catch();
    }
}

export const getData = () => {
    let storage = JSON.parse(localStorage.getItem("userData"))
    let token = localStorage.getItem("token")
    return (dispatch) => {
        axios.get("http://localhost:5555/auth/getdata", {
            params: {
                userId: storage[0].userId
            },
            headers: {
                authorization: token
            }
        })
            .then(res => {
                localStorage.setItem(
                    "userData",
                    JSON.stringify(res.data)
                );
                dispatch(
                    {
                        type: "LOGIN_SUCCESS",
                        payload: res.data
                    }
                )
            })
            .catch()
    }
}

