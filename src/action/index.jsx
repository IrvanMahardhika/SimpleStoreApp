import axios from "axios";

export const headerChange = ()=>{
    return {
        type : "CHANGE_HEADER"
    }
}

export const headerSearchbox = ()=>{
    return {
        type : "HEADER_SEARCH_BOX"
    }
}

export const login = (keyword, password, rememberMe)=>{
    return (dispatch) => {
        axios.get("http://localhost:5555/auth/getlogin", {
            params : {
                username : keyword,
                email : keyword,
                cellphone : keyword,
                password : password
            }
        })
        .then(res=>{   
            if (res.data.length===0) {
                alert("User not found")
            } else if (res.data.length>0 && rememberMe===true) {
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
                        type : "LOGIN_SUCCESS",
                        payload : res.data
                    }
                )
            } else if (res.data.length>0 && rememberMe===false) {
                alert("Login Success.");
                localStorage.setItem(
                    "userData",
                    JSON.stringify(res.data)
                );
                localStorage.removeItem("rememberMe");
                dispatch(
                    {
                        type : "LOGIN_SUCCESS",
                        payload : res.data
                    }
                )
            }
            axios.post("http://localhost:5555/auth/gettoken",{
                username : res.data[0].username
            })
            .then(res=>{
                localStorage.setItem("token",res.data.token);
            }).catch()
        })
        .catch()
    }
}

export const keepLogin = (val)=>{
    return {
        type : "LOGIN_SUCCESS",
        payload : val
    }
}

export const logout = ()=>{
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    localStorage.removeItem("setproductId");
    alert("Logout Success.");
    return {
        type : "LOGOUT_SUCCESS"
    }
}

export const addUser = (val)=>{
    return (dispatch) => {
        axios.get("http://localhost:5555/auth/getlogin", {
            params : {
                username : val.username,
                email : val.email,
                cellphone : val.cellphone
            }
        })
        .then(res=>{
            if (res.data.length>0) {
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
                        fullname : val.fullname,
                        cellphone : val.cellphone,
                        email : val.email,
                        gender : val.gender,
                        username : val.username,
                        password : val.retype_password
                    }
                )
                .then(res=>{
                    alert("Register success.\nPlease verify your email, by clicking the link we have sent.");
                    axios.get("http://localhost:5555/mail/sendverifyemail", {
                        params : {
                            email : val.email,
                            gender : val.gender,
                            fullname : val.fullname,
                            username : val.username
                        }
                    }).then().catch();
                    dispatch(
                        {
                            type : "REGISTER_SUCCESS"
                        }
                    )
                })
                .catch()
            }
        })
        .catch()
    }
}

export const sendLinkChangePasswordEmail = (val)=>{
    return (dispatch) => {
        axios.get("http://localhost:5555/auth/getlogin", {
            params : {
                username : val,
                email : val,
                cellphone : val
            }
        })
        .then(res=>{
            if (res.data.length===0) {
                alert("E-mail not found")
            } else {
                alert("A link to reset you password, has been sent to your email.");
                axios.get("http://localhost:5555/mail/sendlinkchangepasswordemail", {
                    params : {
                        email : res.data[0].email,
                        gender : res.data[0].gender,
                        fullname : res.data[0].fullname,
                        username : res.data[0].username
                    }
                }).then().catch();
                dispatch(
                    {
                        type : "REGISTER_SUCCESS"
                    }
                )
            }
        })
        .catch()
    }
}


export const changePassword = (val)=>{
    return (dispatch) => {
        axios.put("http://localhost:5555/auth/changePassword",
            {
                username : val.username,
                password : val.retype_password
            }
            )
            .then(res=>{
                alert("Your password has been changed.\nPlease try to login using your new password.");
            })
            .catch()
            dispatch(
                {
                    type : "REGISTER_SUCCESS"
                }
            )
    }
}

export const sendVerifyEmail = (val)=>{
    return (dispatch) => {
        alert("Verification link has been sent to your e-mail.");
        axios.get("http://localhost:5555/mail/sendverifyemail", {
            params : {
                email : val.email,
                gender : val.gender,
                fullname : val.fullname,
                username : val.username
            }
        }).then().catch();
    } 
}

export const getData = ()=>{
    let storage = JSON.parse(localStorage.getItem("userData"))
    let token = localStorage.getItem("token")
    return (dispatch) => {
        axios.get("http://localhost:5555/auth/getdata", {
            params : {
                userId : storage[0].userId
            },
            headers : {
                authorization : token
            }
        })
        .then(res=>{
            localStorage.setItem(
                "userData",
                JSON.stringify(res.data)
            );
            dispatch(
                {
                    type : "LOGIN_SUCCESS",
                    payload : res.data
                }
            )
        })
        .catch()
    }
}

