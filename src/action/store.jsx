import axios from "axios";

export const showLocation = (postalcode)=>{
    return (dispatch) => {
        axios.get("http://localhost:5555/store/getlocation", {
            params : {
                postalcode : postalcode
            }
        })
        .then(res=>{
            if (res.data.length===0) {
                alert("Postal code not found")
            } else {
                dispatch(
                    {
                        type : "GET_LOCATION_SUCCESS",
                        payload : res.data
                    }
                )
            } 
        })
        .catch()
    }
}

export const addStore = (val,district,cityregency,province,userid)=>{
    return (dispatch) => {
        axios.post("http://localhost:5555/store/addstoretostores",
        {
            name : val.storename,
            address : val.address,
            district : district,
            cityregency :cityregency,
            province : province,
            postalcode : val.postalCode,
            userid : userid
        }
        ).then().catch()
        axios.put("http://localhost:5555/store/addstoretousers",
        {
            name : val.storename,
            userid : userid
        }
        ).then().catch()
    }
}

export const finish = (keyword)=>{
    return (dispatch) => {
        axios.get("http://localhost:5555/auth/getlogin", {
            params : {
                username : keyword,
                email : keyword,
                cellphone : keyword
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