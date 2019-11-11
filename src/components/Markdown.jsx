import React,{Component} from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import axios from "axios";
import NumberFormat from "react-number-format";
import {Button, Input, FormGroup, FormFeedback, Badge, Label} from 'reactstrap';

class Markdown extends Component {

    state = {
        productList : [],
        productListFurniture : [],
        markdown : [],
        showPercent : [],
        showValue : [],
        forReRender : true,
        uploadMarkdown : [],
        startDate : "",
        startMonth : "",
        startYear : "",
        endDate : "",
        endMonth : "",
        endYear : "",
        markdown1List : [], markdown2List : [], markdown3List : [], markdown4List : [], markdown5List : [],
        global : false,
        filterCategory : "",
        blankPercent : "",
        blankValue : "",
        continueSaveMarkdown : true
    }

    componentDidMount () {
        let storage = JSON.parse(localStorage.getItem("userData"))
        if (storage) {
            this.clear()
            this.getProductList()
            this.getMarkdown1()
            this.getMarkdown2()
            this.getMarkdown3()
            this.getMarkdown4()
            this.getMarkdown5()
        }
    }

    clear = ()=>{
        let a = []
        let b = []
        let c = []
        for (let i=0; i<this.state.productList.length; i++) {a.push("a");b.push("a");c.push("a")}
        this.setState({markdown:a,showPercent:b,showValue:c,uploadMarkdown:[],blankPercent:"",blankValue:"",
            endDate:"",endMonth:"",endYear:"",startDate:"",startMonth:"",startYear:""})
    }

    getProductList = ()=>{
        let token = localStorage.getItem("token")
        axios.get("http://localhost:5555/prod/getapprovedproduct", {
            params : {
                storename : this.props.loginRedux[0].storename
            },
            headers : {
                authorization : token
            }
        })
        .then(res=>{
            this.setState({productList:res.data})
            let a = []
            let b = []
            let c = []
            for (let i=0; i<this.state.productList.length; i++) {a.push("a");b.push("a");c.push("a")}
            this.setState({markdown:a,showPercent:b,showValue:c})
        })
        .catch()
    }

    testMarkdown = (value,index,price,type)=>{
        let a = this.state.markdown
        let b = this.state.showPercent
        let c = this.state.showValue
        switch (true) {
            case value==="" && this.state.global===false:
                a[index]=0
                b[index]="a"
                c[index]="a"
                this.setState({markdown:a,showPercent:b,showValue:c})
                break;
            case value==="" && this.state.global===true:
                a=a.map(val=>0)
                b=b.map(val=>"a")
                c=c.map(val=>"a")
                this.setState({markdown:a,showPercent:b,showValue:c})
                break;
            case type===1 && this.state.global===false:
                let z1=price*value/100    
                a[index]=z1
                b[index]=value
                c[index]="b"
                this.setState({markdown:a,showPercent:b,showValue:c})
                break;
            case type===1 && this.state.global===true && this.state.filterCategory!=="":
                let z3 = this.state.productList.filter(val=>val.category===this.state.filterCategory).map(val=>val.price*value/100)
                a=z3
                b=b.map(val=>value)
                c=c.map(val=>"b")
                this.setState({markdown:a,showPercent:b,showValue:c})
                break
            case type===1 && this.state.global===true && this.state.filterCategory==="":
                let z2 = this.state.productList.map(val=>val.price*value/100)
                a=z2
                b=b.map(val=>value)
                c=c.map(val=>"b")
                this.setState({markdown:a,showPercent:b,showValue:c})
                break;
            case type===2 && this.state.global===false:
                value = value.replace(/,/g,"")
                a[index]=value
                b[index]="b"
                c[index]=value
                this.setState({markdown:a,showPercent:b,showValue:c})
                break;
            case type===2 && this.state.global===true:
                value = value.replace(/,/g,"")
                a=a.map(val=>value)
                b=b.map(val=>"b")
                c=c.map(val=>value)
                this.setState({markdown:a,showPercent:b,showValue:c})
                break;
            default:
                break
        }
    }

    getUploadMarkdown = (value,productId,type)=>{
        switch (true) {
            case value==="" && this.state.global===false:
                let r = this.state.uploadMarkdown.filter(val=>val.productId!==productId)
                this.setState({uploadMarkdown:r})
                break
            case value==="" && this.state.global===true:
                this.setState({uploadMarkdown:[]})
                break
            case this.state.global===false:
                value = value.replace(/,/g,"")
                let y={
                    markdown : value,
                    productId : productId,
                    type : type
                }
                let z = this.state.uploadMarkdown.filter(val=>val.productId!==productId)
                z.push(y)
                this.setState({uploadMarkdown:z})
                break
            case this.state.global===true && this.state.filterCategory==="":
                value = value.replace(/,/g,"")
                let x = this.state.productList.map(val=>val.productId)
                let v = []
                for (let i=0; i<x.length; i++) {
                    let w={
                        markdown : value,
                        productId : x[i],
                        type : type
                    }
                    v.push(w)
                }
                this.setState({uploadMarkdown:v})
                break
            case this.state.global===true && this.state.filterCategory!=="":
                value = value.replace(/,/g,"")
                let s = this.state.productList.filter(val=>val.category===this.state.filterCategory).map(val=>val.productId)
                let t = []
                for (let i=0; i<s.length; i++) {
                    let u={
                        markdown : value,
                        productId : s[i],
                        type : type
                    }
                    t.push(u)
                }
                this.setState({uploadMarkdown:t})
                break
            default:
                break;
        }
    }

    uploadMarkdown = ()=>{
        let e = []
        for (let i=0; i<this.state.uploadMarkdown.length; i++) {
            let a = this.state.productList.filter(val=>val.productId===this.state.uploadMarkdown[i].productId)
            e.push(a[0].price-parseInt(this.state.uploadMarkdown[i].markdown)) 
        }
        switch (true) {
            case this.state.uploadMarkdown.length===0:
                alert("there is no markdown to be saved")
                break;
            case e.filter(val=>val<=0).length>0:
                alert("Your markdown must not resulting 0 price or lower")
                break;
            case this.state.uploadMarkdown.filter(val=>val.type===2 && val.markdown<10000).length>0:
                alert("Your markdown must at least IDR 10.000 or more")
                break;
            case this.state.uploadMarkdown.filter(val=>val.type===1 && val.markdown<10).length>0:
                alert("Your markdown must at least 10% or more")
                break;
            default:
                let data = {}
                switch (true) {
                    case this.state.markdown1List.length===0:
                        data = {...data, markdownname : "Markdown 1"}
                        break;
                    case this.state.markdown2List.length===0:
                        data = {...data, markdownname : "Markdown 2"}
                        break;
                    case this.state.markdown3List.length===0:
                        data = {...data, markdownname : "Markdown 3"}
                        break;
                    case this.state.markdown4List.length===0:
                        data = {...data, markdownname : "Markdown 4"}
                        break;
                    case this.state.markdown5List.length===0:
                        data = {...data, markdownname : "Markdown 5"}
                        break;
                    default:
                        break;
                }
                let start = []
                let end = []
                let d = new Date()
                let a = d.getFullYear()
                let b = d.getMonth()+1
                let c = d.getDate()
                switch (true) {
                    case !this.state.startYear || !this.state.startMonth || !this.state.startDate:
                        alert("select start period")
                        break;
                    case (parseInt(this.state.startYear)===a && parseInt(this.state.startMonth)<b) || (parseInt(this.state.startYear)===a && parseInt(this.state.startMonth)===b && parseInt(this.state.startDate)<=c) :
                        alert("start period at least has to be tomorrow")
                        break
                    case !this.state.endYear || !this.state.endMonth || !this.state.endDate:
                        alert("select end period")
                        break;
                    case (parseInt(this.state.endYear)===parseInt(this.state.startYear) && parseInt(this.state.endMonth)<parseInt(this.state.startMonth)) || (parseInt(this.state.endYear)===parseInt(this.state.startYear) && parseInt(this.state.endMonth)===parseInt(this.state.startMonth) && parseInt(this.state.endDate)<=parseInt(this.state.startDate)) :
                        alert("end period at least has to be the next day after start period")
                        break
                    default:
                        start.push(this.state.startYear)
                        start.push(this.state.startMonth)
                        start.push(this.state.startDate)
                        start = start.join("")
                        data = {...data, start}
                        end.push(this.state.endYear)
                        end.push(this.state.endMonth)
                        end.push(this.state.endDate)
                        end = end.join("")
                        data = {...data, end}
                        let continueAfterMap = []
                        this.state.uploadMarkdown.map(val=>{
                            let token = localStorage.getItem("token")
                            axios.get("http://localhost:5555/prod/checkmarkdown", {
                                params : {
                                    storename : this.props.loginRedux[0].storename,
                                    productId : val.productId,
                                    start : start,
                                    end : end
                                },
                                headers : {
                                    authorization : token
                                }
                            })
                            .then(res=>{
                                continueAfterMap.push("go")
                                if (res.data.length>0) {
                                    alert(`Can not save markdown !\n\n${res.data[0].brand} ${res.data[0].name} has been set for another markdown,\n    from ${new Date(res.data[0].start).toLocaleDateString("id", {day:"numeric", month:"short", year:"numeric"})}\n    until ${new Date(res.data[0].end).toLocaleDateString("id", {day:"numeric", month:"short", year:"numeric"})}.\n\nCheck ${res.data[0].markdownname} below`)
                                    this.setState({continueSaveMarkdown:false})
                                }
                                if (this.state.continueSaveMarkdown===true && continueAfterMap.length===this.state.uploadMarkdown.length) {
                                    this.state.uploadMarkdown.map(item=>{
                                        if (item.markdown<100) {
                                            axios.post("http://localhost:5555/prod/addmarkdown", data)
                                            .then(pos=>{
                                                axios.put("http://localhost:5555/prod/addmarkdownfinal", {
                                                    productId : item.productId,
                                                    discpercent : item.markdown,
                                                    markdownId : pos.data.insertId
                                                }).then().catch()
                                                this.getMarkdown1()
                                                this.getMarkdown2()
                                                this.getMarkdown3()
                                                this.getMarkdown4()
                                                this.getMarkdown5() 
                                            })
                                            .catch()
                                        } else {
                                            axios.post("http://localhost:5555/prod/addmarkdown", data)
                                            .then(pos=>{
                                                axios.put("http://localhost:5555/prod/addmarkdownfinal", {
                                                    productId : item.productId,
                                                    discvalue : item.markdown,
                                                    markdownId : pos.data.insertId
                                                }).then().catch()
                                                this.getMarkdown1()
                                                this.getMarkdown2()
                                                this.getMarkdown3()
                                                this.getMarkdown4()
                                                this.getMarkdown5()
                                            })
                                            .catch()
                                        }
                                    })
                                    alert("Markdown has been saved, and will take effect on the set date.\nCheck your markdowns below.")
                                    this.clear()
                                }
                                // if agar : mengembalikan state continueAfterMap menjadi true, stlh map pertama selesai
                                if (continueAfterMap.length===this.state.uploadMarkdown.length) {
                                    this.setState({continueSaveMarkdown:true})
                                }
                            })
                            .catch()     
                        })
                        break;
                }
                break;
        }    
    }

    getMarkdown1 = ()=>{
        let token = localStorage.getItem("token")
        axios.get("http://localhost:5555/prod/getmarkdown", {
            params : {
                markdownname : "Markdown 1",
                storename : this.props.loginRedux[0].storename
            },
            headers : {
                authorization : token
            }
        })
        .then(res=>{
            this.setState({markdown1List:res.data})
        })
        .catch()
    }

    getMarkdown2 = ()=>{
        let token = localStorage.getItem("token")
        axios.get("http://localhost:5555/prod/getmarkdown", {
            params : {
                markdownname : "Markdown 2",
                storename : this.props.loginRedux[0].storename
            },
            headers : {
                authorization : token
            }
        })
        .then(res=>{
            this.setState({markdown2List:res.data})
        })
        .catch()
    }

    getMarkdown3 = ()=>{
        let token = localStorage.getItem("token")
        axios.get("http://localhost:5555/prod/getmarkdown", {
            params : {
                markdownname : "Markdown 3",
                storename : this.props.loginRedux[0].storename
            },
            headers : {
                authorization : token
            }
        })
        .then(res=>{
            this.setState({markdown3List:res.data})
        })
        .catch()
    }

    getMarkdown4 = ()=>{
        let token = localStorage.getItem("token")
        axios.get("http://localhost:5555/prod/getmarkdown", {
            params : {
                markdownname : "Markdown 4",
                storename : this.props.loginRedux[0].storename
            },
            headers : {
                authorization : token
            }
        })
        .then(res=>{
            this.setState({markdown4List:res.data})
        })
        .catch()
    }

    getMarkdown5 = ()=>{
        let token = localStorage.getItem("token")
        axios.get("http://localhost:5555/prod/getmarkdown", {
            params : {
                markdownname : "Markdown 5",
                storename : this.props.loginRedux[0].storename
            },
            headers : {
                authorization : token
            }
        })
        .then(res=>{
            this.setState({markdown5List:res.data})
        })
        .catch()
    }

    deleteMarkdown = (value)=>{
        switch (true) {
            case value===1:
                this.state.markdown1List.map(val=>{
                    axios.delete("http://localhost:5555/prod/deletemarkdown/"+val.markdownId)
                    .then(res=>{
                        this.getMarkdown1()
                    })
                    .catch()
                })
                alert("Markdown 1 has been deleted")
                break;
            case value===2:
                this.state.markdown2List.map(val=>{
                    axios.delete("http://localhost:5555/prod/deletemarkdown/"+val.markdownId)
                    .then(res=>{
                        this.getMarkdown2()
                    })
                    .catch()
                })
                alert("Markdown 2 has been deleted")
                break;
            case value===3:
                this.state.markdown3List.map(val=>{
                    axios.delete("http://localhost:5555/prod/deletemarkdown/"+val.markdownId)
                    .then(res=>{
                        this.getMarkdown3()
                    })
                    .catch()
                })
                alert("Markdown 3 has been deleted")
                break;
            case value===4:
                this.state.markdown4List.map(val=>{
                    axios.delete("http://localhost:5555/prod/deletemarkdown/"+val.markdownId)
                    .then(res=>{
                        this.getMarkdown4()
                    })
                    .catch()
                })
                alert("Markdown 4 has been deleted")
                break;
            case value===5:
                this.state.markdown5List.map(val=>{
                    axios.delete("http://localhost:5555/prod/deletemarkdown/"+val.markdownId)
                    .then(res=>{
                        this.getMarkdown5()
                    })
                    .catch()
                })
                alert("Markdown 5 has been deleted")
                break;
            default:
                break;
        }
        this.setState({global:false,filterCategory:""})
        this.clear()
        var ele = document.getElementsByName("radio1")
        for (var i=0; i<ele.length;i++){
            if (i===0){ele[i].checked=true}
            else {ele[i].checked=false}
        }
    }

    renderYear = ()=>{
        let d = new Date()
        let x = d.getFullYear()
        let y = []
        for(let i=0; i<3; i++){y.push(x+i)}
        let z = y.map(val=>{
            return (
                <option value={val} >{val}</option>
            )
        })
        return z
    }

    renderStartDate = ()=>{
        let y = []
        switch (true) {
            case parseInt(this.state.startMonth)===1|| parseInt(this.state.startMonth)===3|| parseInt(this.state.startMonth)===5|| parseInt(this.state.startMonth)===7|| parseInt(this.state.startMonth)===8|| parseInt(this.state.startMonth)===10|| parseInt(this.state.startMonth)===12:
                for(let i=1; i<32; i++){
                    if (i<10) {y.push("0"+i)}
                    else {y.push(i)}
                }
                break;
            case parseInt(this.state.startMonth)===4|| parseInt(this.state.startMonth)===6|| parseInt(this.state.startMonth)===9|| parseInt(this.state.startMonth)===11:
                for(let i=1; i<31; i++){
                    if (i<10) {y.push("0"+i)}
                    else {y.push(i)}
                }
                break;
            case parseInt(this.state.startMonth)===2 && parseInt(this.state.startYear)%4===0:
                for(let i=1; i<30; i++){
                    if (i<10) {y.push("0"+i)}
                    else {y.push(i)}
                }
                break;
            case parseInt(this.state.startMonth)===2 && parseInt(this.state.startYear)%4!==0:
                    for(let i=1; i<29; i++){
                        if (i<10) {y.push("0"+i)}
                        else {y.push(i)}
                    }
                    break;
            default:
                break;
        }
        let z = y.map(val=>{
            return (
                <option value={val} >{val}</option>
            )
        })
        return z
    }

    renderEndDate = ()=>{
        let y = []
        switch (true) {
            case parseInt(this.state.endMonth)===1|| parseInt(this.state.endMonth)===3|| parseInt(this.state.endMonth)===5|| parseInt(this.state.endMonth)===7|| parseInt(this.state.endMonth)===8|| parseInt(this.state.endMonth)===10|| parseInt(this.state.endMonth)===12:
                for(let i=1; i<32; i++){
                    if (i<10) {y.push("0"+i)}
                    else {y.push(i)}
                }
                break;
            case parseInt(this.state.endMonth)===4|| parseInt(this.state.endMonth)===6|| parseInt(this.state.endMonth)===9|| parseInt(this.state.endMonth)===11:
                for(let i=1; i<31; i++){
                    if (i<10) {y.push("0"+i)}
                    else {y.push(i)}
                }
                break;
            case parseInt(this.state.endMonth)===2 && parseInt(this.state.endYear)%4===0:
                for(let i=1; i<30; i++){
                    if (i<10) {y.push("0"+i)}
                    else {y.push(i)}
                }
                break;
            case parseInt(this.state.endMonth)===2 && parseInt(this.state.endYear)%4!==0:
                    for(let i=1; i<29; i++){
                        if (i<10) {y.push("0"+i)}
                        else {y.push(i)}
                    }
                    break;
            default:
                break;
        }
        let z = y.map(val=>{
            return (
                <option value={val} >{val}</option>
            )
        })
        return z
    }

    renderAllProductOneByOne = ()=>{
        let map = this.state.productList.map((val,index)=>{
            return (
                <tr>
                    <td className="p-2 text-center align-text-top" >{index+1}</td>
                    <td className="p-2 text-center align-text-top" >{val.category}</td>
                    <td className="p-2 text-center align-text-top" >{val.brand}</td>
                    <td className="p-2 text-center align-text-top" >{val.name}</td>
                    <td className="p-2 text-center align-text-top" >{val.inventory}</td>
                    <td className="p-2 text-center align-text-top" >{val.measurement}</td>
                    <td className="p-2 text-center align-text-top" >
                        <NumberFormat value={val.price} displayType={'text'} thousandSeparator={true} />
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        <img src={"http://localhost:5555/"+val.productpic1} style={{height:"50px",width:"50px",objectFit:"cover"}} alt="No pic" />
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        <FormGroup className="m-0">
                            <NumberFormat allowNegative={false} disabled={this.state.showPercent[index]==="b"} maxLength="2" value={this.state.showPercent[index]} style={{width:"60px"}} decimalScale="0" onBlur={e=>this.getUploadMarkdown(e.target.value,val.productId,1)} onChange={e=>{this.testMarkdown(e.target.value,index,val.price,1)}} />
                            <Input invalid={this.state.showPercent[index]<10} className="d-none" />
                            <FormFeedback onInvalid>min 10%</FormFeedback>
                        </FormGroup>
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        <FormGroup className="m-0">
                            <NumberFormat allowNegative={false} disabled={this.state.showValue[index]==="b"} value={this.state.showValue[index]} style={{width:"140px"}} decimalScale="0" thousandSeparator={true} onBlur={e=>this.getUploadMarkdown(e.target.value,val.productId,2)} onChange={e=>{this.testMarkdown(e.target.value,index,val.price,2)}} />
                            <Input invalid={this.state.showValue[index]<10000} className="d-none" />
                            <FormFeedback onInvalid>min IDR 10.000</FormFeedback>
                        </FormGroup>
                    </td>
                    <td className="p-2 text-center align-text-top text-success" >
                        <NumberFormat value={val.price-this.state.markdown[index]} displayType={'text'} thousandSeparator={true} />
                    </td>
                </tr>
            )
        })
        return map
    }

    renderAllProductGlobal = ()=>{
        if (this.state.filterCategory) {
            let map = this.state.productList.filter(val=>val.category===this.state.filterCategory).map((val,index)=>{
                return (
                    <tr>
                        <td className="p-2 text-center align-text-top" >{index+1}</td>
                        <td className="p-2 text-center align-text-top" >{val.category}</td>
                        <td className="p-2 text-center align-text-top" >{val.brand}</td>
                        <td className="p-2 text-center align-text-top" >{val.name}</td>
                        <td className="p-2 text-center align-text-top" >{val.inventory}</td>
                        <td className="p-2 text-center align-text-top" >{val.measurement}</td>
                        <td className="p-2 text-center align-text-top" >
                            <NumberFormat value={val.price} displayType={'text'} thousandSeparator={true} />
                        </td>
                        <td className="p-2 text-center align-text-top" >
                            <img src={"http://localhost:5555/"+val.productpic1} style={{height:"50px",width:"50px",objectFit:"cover"}} alt="No pic" />
                        </td>
                        <td className="p-2 text-center align-text-top text-success" >
                            <NumberFormat value={val.price- parseInt(this.state.markdown[index]) } displayType={'text'} thousandSeparator={true} />
                        </td>
                    </tr>
                )
            })
            return map
        } else {
            let map = this.state.productList.map((val,index)=>{
                return (
                    <tr>
                        <td className="p-2 text-center align-text-top" >{index+1}</td>
                        <td className="p-2 text-center align-text-top" >{val.category}</td>
                        <td className="p-2 text-center align-text-top" >{val.brand}</td>
                        <td className="p-2 text-center align-text-top" >{val.name}</td>
                        <td className="p-2 text-center align-text-top" >{val.inventory}</td>
                        <td className="p-2 text-center align-text-top" >{val.measurement}</td>
                        <td className="p-2 text-center align-text-top" >
                            <NumberFormat value={val.price} displayType={'text'} thousandSeparator={true} />
                        </td>
                        <td className="p-2 text-center align-text-top" >
                            <img src={"http://localhost:5555/"+val.productpic1} style={{height:"50px",width:"50px",objectFit:"cover"}} alt="No pic" />
                        </td>
                        <td className="p-2 text-center align-text-top text-success" >
                            <NumberFormat value={val.price-this.state.markdown[index]} displayType={'text'} thousandSeparator={true} />
                        </td>
                    </tr>
                )
            })
            return map
        }
    }

    renderMarkdown1 = ()=>{
        let map = this.state.markdown1List.map((val,index)=>{
            return (
                <tr>
                    <td className="p-2 text-center align-text-top" >{index+1}</td>
                    <td className="p-2 text-center align-text-top" >{val.category}</td>
                    <td className="p-2 text-center align-text-top" >{val.brand}</td>
                    <td className="p-2 text-center align-text-top" >{val.name}</td>
                    <td className="p-2 text-center align-text-top" >{val.inventory}</td>
                    <td className="p-2 text-center align-text-top" >{val.measurement}</td>
                    <td className="p-2 text-center align-text-top" >
                        <NumberFormat value={val.price} displayType={'text'} thousandSeparator={true} />
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        <img src={"http://localhost:5555/"+val.productpic1} style={{height:"50px",width:"50px",objectFit:"cover"}} alt="No pic" />
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        {val.discpercent}
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        <NumberFormat value={val.discvalue} displayType={'text'} thousandSeparator={true} />
                    </td>
                    {
                        val.discpercent!==null
                        ?
                        <td className="p-2 text-center align-text-top text-success" >
                            <NumberFormat value={val.price*(100-val.discpercent)/100} displayType={'text'} thousandSeparator={true} />
                        </td>
                        :
                        <td className="p-2 text-center align-text-top text-success" >
                            <NumberFormat value={val.price-val.discvalue} displayType={'text'} thousandSeparator={true} />
                        </td>
                    }
                    
                </tr>
            )
        })
        return map
    }

    renderMarkdown2 = ()=>{
        let map = this.state.markdown2List.map((val,index)=>{
            return (
                <tr>
                    <td className="p-2 text-center align-text-top" >{index+1}</td>
                    <td className="p-2 text-center align-text-top" >{val.category}</td>
                    <td className="p-2 text-center align-text-top" >{val.brand}</td>
                    <td className="p-2 text-center align-text-top" >{val.name}</td>
                    <td className="p-2 text-center align-text-top" >{val.inventory}</td>
                    <td className="p-2 text-center align-text-top" >{val.measurement}</td>
                    <td className="p-2 text-center align-text-top" >
                        <NumberFormat value={val.price} displayType={'text'} thousandSeparator={true} />
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        <img src={"http://localhost:5555/"+val.productpic1} style={{height:"50px",width:"50px",objectFit:"cover"}} alt="No pic" />
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        {val.discpercent}
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        <NumberFormat value={val.discvalue} displayType={'text'} thousandSeparator={true} />
                    </td>
                    {
                        val.discpercent!==null
                        ?
                        <td className="p-2 text-center align-text-top text-success" >
                            <NumberFormat value={val.price*(100-val.discpercent)/100} displayType={'text'} thousandSeparator={true} />
                        </td>
                        :
                        <td className="p-2 text-center align-text-top text-success" >
                            <NumberFormat value={val.price-val.discvalue} displayType={'text'} thousandSeparator={true} />
                        </td>
                    }
                    
                </tr>
            )
        })
        return map
    }

    renderMarkdown3 = ()=>{
        let map = this.state.markdown3List.map((val,index)=>{
            return (
                <tr>
                    <td className="p-2 text-center align-text-top" >{index+1}</td>
                    <td className="p-2 text-center align-text-top" >{val.category}</td>
                    <td className="p-2 text-center align-text-top" >{val.brand}</td>
                    <td className="p-2 text-center align-text-top" >{val.name}</td>
                    <td className="p-2 text-center align-text-top" >{val.inventory}</td>
                    <td className="p-2 text-center align-text-top" >{val.measurement}</td>
                    <td className="p-2 text-center align-text-top" >
                        <NumberFormat value={val.price} displayType={'text'} thousandSeparator={true} />
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        <img src={"http://localhost:5555/"+val.productpic1} style={{height:"50px",width:"50px",objectFit:"cover"}} alt="No pic" />
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        {val.discpercent}
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        <NumberFormat value={val.discvalue} displayType={'text'} thousandSeparator={true} />
                    </td>
                    {
                        val.discpercent!==null
                        ?
                        <td className="p-2 text-center align-text-top text-success" >
                            <NumberFormat value={val.price*(100-val.discpercent)/100} displayType={'text'} thousandSeparator={true} />
                        </td>
                        :
                        <td className="p-2 text-center align-text-top text-success" >
                            <NumberFormat value={val.price-val.discvalue} displayType={'text'} thousandSeparator={true} />
                        </td>
                    }
                    
                </tr>
            )
        })
        return map
    }

    renderMarkdown4 = ()=>{
        let map = this.state.markdown4List.map((val,index)=>{
            return (
                <tr>
                    <td className="p-2 text-center align-text-top" >{index+1}</td>
                    <td className="p-2 text-center align-text-top" >{val.category}</td>
                    <td className="p-2 text-center align-text-top" >{val.brand}</td>
                    <td className="p-2 text-center align-text-top" >{val.name}</td>
                    <td className="p-2 text-center align-text-top" >{val.inventory}</td>
                    <td className="p-2 text-center align-text-top" >{val.measurement}</td>
                    <td className="p-2 text-center align-text-top" >
                        <NumberFormat value={val.price} displayType={'text'} thousandSeparator={true} />
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        <img src={"http://localhost:5555/"+val.productpic1} style={{height:"50px",width:"50px",objectFit:"cover"}} alt="No pic" />
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        {val.discpercent}
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        <NumberFormat value={val.discvalue} displayType={'text'} thousandSeparator={true} />
                    </td>
                    {
                        val.discpercent!==null
                        ?
                        <td className="p-2 text-center align-text-top text-success" >
                            <NumberFormat value={val.price*(100-val.discpercent)/100} displayType={'text'} thousandSeparator={true} />
                        </td>
                        :
                        <td className="p-2 text-center align-text-top text-success" >
                            <NumberFormat value={val.price-val.discvalue} displayType={'text'} thousandSeparator={true} />
                        </td>
                    }
                    
                </tr>
            )
        })
        return map
    }

    renderMarkdown5 = ()=>{
        let map = this.state.markdown5List.map((val,index)=>{
            return (
                <tr>
                    <td className="p-2 text-center align-text-top" >{index+1}</td>
                    <td className="p-2 text-center align-text-top" >{val.category}</td>
                    <td className="p-2 text-center align-text-top" >{val.brand}</td>
                    <td className="p-2 text-center align-text-top" >{val.name}</td>
                    <td className="p-2 text-center align-text-top" >{val.inventory}</td>
                    <td className="p-2 text-center align-text-top" >{val.measurement}</td>
                    <td className="p-2 text-center align-text-top" >
                        <NumberFormat value={val.price} displayType={'text'} thousandSeparator={true} />
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        <img src={"http://localhost:5555/"+val.productpic1} style={{height:"50px",width:"50px",objectFit:"cover"}} alt="No pic" />
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        {val.discpercent}
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        <NumberFormat value={val.discvalue} displayType={'text'} thousandSeparator={true} />
                    </td>
                    {
                        val.discpercent!==null
                        ?
                        <td className="p-2 text-center align-text-top text-success" >
                            <NumberFormat value={val.price*(100-val.discpercent)/100} displayType={'text'} thousandSeparator={true} />
                        </td>
                        :
                        <td className="p-2 text-center align-text-top text-success" >
                            <NumberFormat value={val.price-val.discvalue} displayType={'text'} thousandSeparator={true} />
                        </td>
                    }
                    
                </tr>
            )
        })
        return map
    }

    render () {
        switch (true) {
            case this.props.loginRedux.length>0:
                return (
                    <div className="mt-3 mx-5" id="curtain2">
                        <h1>{this.props.loginRedux[0].storename}'s Product Price Markdown</h1>
                        <br></br>
                        {
                            this.state.markdown1List.length>0 && this.state.markdown2List.length>0 && this.state.markdown3List.length>0 && this.state.markdown4List.length>0 && this.state.markdown5List.length>0
                            ?
                            <h5 className="mb-3" >
                                You already use maximum amount of 5 markdowns.
                                <br></br>
                                Delete one of the markdown to set a new one.
                            </h5>
                            :
                            <div>
                                <table className="border mb-1" style={{width:"1000px"}} >
                                    <thead>
                                        <tr>
                                            <td className="h5 pl-3 border-bottom" colSpan="2" >
                                                Set Markdown
                                            </td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border-right" rowSpan="2">
                                                <FormGroup className="ml-5" tag="fieldset">
                                                    <Label className="mt-1 mb-2" check>
                                                        <Input type="radio" name="radio1" onClick={()=>{this.setState({global:false});this.clear()}} defaultChecked />
                                                        Set markdown one by one
                                                    </Label>
                                                    <br></br>
                                                    <Label check>
                                                        <Input type="radio" name="radio1" onClick={()=>{this.setState({global:true});this.clear()}} />
                                                        Set markdown globally
                                                    </Label>
                                                </FormGroup>
                                            </td>
                                            <td > 
                                                <span className="ml-3" >Start Date :&nbsp;
                                                    <select disabled={!this.state.startMonth||!this.state.startYear} value={this.state.startDate} onClick={e=>this.setState({startDate:e.target.value})} >
                                                        <option value="" >Date</option>
                                                        {this.renderStartDate()}
                                                    </select>
                                                    &nbsp;
                                                    <select value={this.state.startMonth} onClick={e=>this.setState({startMonth:e.target.value,startDate:""})} >
                                                        <option value="" >Month</option>
                                                        <option value="01" >Jan</option>
                                                        <option value="02" >Feb</option>
                                                        <option value="03" >Mar</option>
                                                        <option value="04" >Apr</option>
                                                        <option value="05" >May</option>
                                                        <option value="06" >Jun</option>
                                                        <option value="07" >Jul</option>
                                                        <option value="08" >Agt</option>
                                                        <option value="09" >Sep</option>
                                                        <option value="10" >Oct</option>
                                                        <option value="11" >Nov</option>
                                                        <option value="12" >Dec</option>
                                                    </select>
                                                    &nbsp;
                                                    <select value={this.state.startYear} onClick={e=>this.setState({startYear:e.target.value,startDate:""})} >
                                                        <option value="" >Year</option>
                                                        {this.renderYear()}
                                                    </select>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span className="ml-3" >End Date :&nbsp;
                                                    <select disabled={!this.state.endMonth||!this.state.endYear} value={this.state.endDate} onClick={e=>this.setState({endDate:e.target.value})} >
                                                        <option value="" >Date</option>
                                                        {this.renderEndDate()}
                                                    </select>
                                                    &nbsp;
                                                    <select value={this.state.endMonth} onClick={e=>this.setState({endMonth:e.target.value,endDate:""})} >
                                                        <option value="" >Month</option>
                                                        <option value="01" >Jan</option>
                                                        <option value="02" >Feb</option>
                                                        <option value="03" >Mar</option>
                                                        <option value="04" >Apr</option>
                                                        <option value="05" >May</option>
                                                        <option value="06" >Jun</option>
                                                        <option value="07" >Jul</option>
                                                        <option value="08" >Agt</option>
                                                        <option value="09" >Sep</option>
                                                        <option value="10" >Oct</option>
                                                        <option value="11" >Nov</option>
                                                        <option value="12" >Dec</option>
                                                    </select>
                                                    &nbsp;
                                                    <select value={this.state.endYear} onClick={e=>this.setState({endYear:e.target.value,endDate:""})} >
                                                        <option value="" >Year</option>
                                                        {this.renderYear()}
                                                    </select>
                                                </span>
                                                <br></br>
                                                <small className="ml-3">start by choosing <b>year</b>, then <b>month</b>, then <b>date</b></small>
                                            </td>
                                        </tr>
                                        {
                                            this.state.global===true
                                            ?
                                            <tr className="border-top">
                                                <td colSpan="2" >
                                                    <FormGroup className="ml-5" tag="fieldset">
                                                        <Label className="mt-1 mr-5" check>
                                                            <Input type="radio" name="radio2" value="" onClick={e=>{this.setState({filterCategory:e.target.value});this.clear()}} defaultChecked />
                                                            All Category
                                                        </Label>
                                                        <Label className="mt-1 mr-5" check>
                                                            <Input type="radio" name="radio2" value="Furniture" onClick={e=>{this.setState({filterCategory:e.target.value});this.clear()}} />
                                                            Furniture
                                                        </Label>
                                                        <Label className="mt-1 mr-5" check>
                                                            <Input type="radio" name="radio2" value="Electronic" onClick={e=>{this.setState({filterCategory:e.target.value});this.clear()}} />
                                                            Electronic
                                                        </Label>
                                                        <Label className="mt-1 mr-5" check>
                                                            <Input type="radio" name="radio2" value="Cellphone" onClick={e=>{this.setState({filterCategory:e.target.value});this.clear()}} />
                                                            Cellphone
                                                        </Label>
                                                        <Label className="mt-1 mr-5" check>
                                                            <Input type="radio" name="radio2" value="Notebook" onClick={e=>{this.setState({filterCategory:e.target.value});this.clear()}} />
                                                            Notebook
                                                        </Label>
                                                        <Label className="mt-1 mr-5" check>
                                                            <Input type="radio" name="radio2" value="Sport" onClick={e=>{this.setState({filterCategory:e.target.value});this.clear()}} />
                                                            Sport
                                                        </Label>
                                                    </FormGroup>
                                                </td>
                                            </tr>
                                            :
                                            null
                                        }
                                    </tbody>
                                </table>
                                {
                                    this.state.global===false
                                    ?
                                    <div>
                                        <table className="table-bordered mb-5" style={{width:"1000px"}} >
                                            <thead style={{backgroundColor:"#ffc61a"}} className="font-weight-bold">
                                                <td></td>
                                                <td className="p-2 text-center align-text-top" >Category</td>
                                                <td className="p-2 text-center align-text-top" >Brand</td>
                                                <td className="p-2 text-center align-text-top" >Name</td>
                                                <td className="p-2 text-center align-text-top" >Inventory</td>
                                                <td className="p-2 text-center align-text-top" >EA</td>
                                                <td className="p-2 text-center align-text-top" >Price (IDR)</td>
                                                <td className="p-2 text-center align-text-top" >Pic</td>
                                                <td className="p-2 text-center align-text-top" >Markdown by %</td>
                                                <td className="p-2 text-center align-text-top" >Markdown by IDR</td>
                                                <td className="p-2 text-center align-text-top" >Price after markdown</td>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td colSpan="11" className="text-right" >
                                                        <small>Go to <b>Markdown by %</b> to set markdown based on %, <b>or</b> go to <b>Markdown by IDR</b> to set it by value</small>
                                                    </td>
                                                </tr>
                                                {this.renderAllProductOneByOne()}
                                                <tr>
                                                    <td colSpan="11" className="text-right" >
                                                        <Button className="m-1" onClick={()=>{this.uploadMarkdown()}} >Save</Button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    :
                                    <div>
                                        <table className="table-bordered mb-5" style={{width:"1000px"}} >
                                            <thead style={{backgroundColor:"#ffc61a"}} className="font-weight-bold">
                                                <td></td>
                                                <td className="p-2 text-center align-text-top" >Category</td>
                                                <td className="p-2 text-center align-text-top" >Brand</td>
                                                <td className="p-2 text-center align-text-top" >Name</td>
                                                <td className="p-2 text-center align-text-top" >Inventory</td>
                                                <td className="p-2 text-center align-text-top" >EA</td>
                                                <td className="p-2 text-center align-text-top" >Price (IDR)</td>
                                                <td className="p-2 text-center align-text-top" >Pic</td>
                                                <td className="p-2 text-center align-text-top" >Price after markdown</td>
                                            </thead>
                                            <tbody>
                                                {this.renderAllProductGlobal()}
                                                <tr>
                                                    <td className="px-2 " colSpan="9" >
                                                        <small>Go to <b>Markdown by %</b> to set markdown based on %, <b>or</b> go to <b>Markdown by IDR</b> to set it by value, then click <Badge color="secondary" >save</Badge> before moving to other category</small>
                                                    </td>
                                                </tr>
                                                <tr >
                                                    <td className="p-2 " colSpan="4" >
                                                        <FormGroup className="m-0">
                                                            Markdown by % : &nbsp;
                                                            <NumberFormat allowNegative={false} value={this.state.blankPercent} decimalScale="0" style={{width:"60px"}} disabled={this.state.showPercent[0]==="b"} maxLength="2" onBlur={e=>this.getUploadMarkdown(e.target.value,null,1)} onChange={e=>{this.testMarkdown(e.target.value,null,null,1);this.setState({blankPercent:e.target.value})}} />
                                                            <Input invalid={this.state.showPercent[0]<10} className="d-none" />
                                                            <FormFeedback style={{marginLeft:"140px"}} onInvalid>min 10%</FormFeedback>
                                                        </FormGroup>
                                                    </td>
                                                    <td className="p-2 " colSpan="4" >
                                                        <FormGroup className="m-0">
                                                            Markdown by IDR : &nbsp;
                                                            <NumberFormat allowNegative={false} value={this.state.blankValue} decimalScale="0" disabled={this.state.showValue[0]==="b"} thousandSeparator={true} onBlur={e=>this.getUploadMarkdown(e.target.value,null,2)} onChange={e=>{this.testMarkdown(e.target.value,null,null,2);this.setState({blankValue:e.target.value})}} />
                                                            <Input invalid={this.state.showValue[0]<10000} className="d-none" />
                                                            <FormFeedback style={{marginLeft:"150px"}} onInvalid>min IDR 10.000</FormFeedback>
                                                        </FormGroup>
                                                    </td>
                                                    <td colSpan="3" className="text-right" >
                                                        <Button className="m-1" onClick={()=>{this.uploadMarkdown()}} >Save</Button>
                                                    </td>
                                                </tr>
                                                
                                            </tbody>
                                        </table>
                                    </div>
                                }
                            </div>
                        }
                        {
                            this.state.markdown1List.length>0
                            ?
                            <div>
                                <h5>Markdown 1</h5>
                                <span className="mr-2" >{new Date(this.state.markdown1List[0].start).toLocaleDateString("id", {day:"numeric", month:"short", year:"numeric"})}</span> to
                                <span className="ml-2" >{new Date(this.state.markdown1List[0].end).toLocaleDateString("id", {day:"numeric", month:"short", year:"numeric"})}</span>
                                <table className="table-bordered mb-1" style={{width:"1000px"}} >
                                    <thead style={{backgroundColor:"#ffc61a"}} className="font-weight-bold">
                                        <td></td>
                                        <td className="p-2 text-center align-text-top" >Category</td>
                                        <td className="p-2 text-center align-text-top" >Brand</td>
                                        <td className="p-2 text-center align-text-top" >Name</td>
                                        <td className="p-2 text-center align-text-top" >Inventory</td>
                                        <td className="p-2 text-center align-text-top" >EA</td>
                                        <td className="p-2 text-center align-text-top" >Price (IDR)</td>
                                        <td className="p-2 text-center align-text-top" >Pic</td>
                                        <td className="p-2 text-center align-text-top" >Markdown by %</td>
                                        <td className="p-2 text-center align-text-top" >Markdown by IDR</td>
                                        <td className="p-2 text-center align-text-top" >Price after markdown</td>
                                    </thead>
                                    <tbody>
                                        {this.renderMarkdown1()}
                                        <tr>
                                            <td colSpan="11" className="text-right" >
                                                <Button className="m-1" onClick={()=>this.deleteMarkdown(1)} >Delete Markdown</Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            :
                            null
                        }
                        {
                            this.state.markdown2List.length>0
                            ?
                            <div>
                                <h5>Markdown 2</h5>
                                <span className="mr-2" >{new Date(this.state.markdown2List[0].start).toLocaleDateString("id", {day:"numeric", month:"short", year:"numeric"})}</span> to
                                <span className="ml-2" >{new Date(this.state.markdown2List[0].end).toLocaleDateString("id", {day:"numeric", month:"short", year:"numeric"})}</span>
                                <table className="table-bordered mb-1" style={{width:"1000px"}} >
                                    <thead style={{backgroundColor:"#ffc61a"}} className="font-weight-bold">
                                        <td></td>
                                        <td className="p-2 text-center align-text-top" >Category</td>
                                        <td className="p-2 text-center align-text-top" >Brand</td>
                                        <td className="p-2 text-center align-text-top" >Name</td>
                                        <td className="p-2 text-center align-text-top" >Inventory</td>
                                        <td className="p-2 text-center align-text-top" >EA</td>
                                        <td className="p-2 text-center align-text-top" >Price (IDR)</td>
                                        <td className="p-2 text-center align-text-top" >Pic</td>
                                        <td className="p-2 text-center align-text-top" >Markdown by %</td>
                                        <td className="p-2 text-center align-text-top" >Markdown by IDR</td>
                                        <td className="p-2 text-center align-text-top" >Price after markdown</td>
                                    </thead>
                                    <tbody>
                                        {this.renderMarkdown2()}
                                        <tr>
                                            <td colSpan="11" className="text-right" >
                                                <Button className="m-1" onClick={()=>this.deleteMarkdown(2)} >Delete Markdown</Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            :
                            null
                        }
                        {
                            this.state.markdown3List.length>0
                            ?
                            <div>
                                <h5>Markdown 3</h5>
                                <span className="mr-2" >{new Date(this.state.markdown3List[0].start).toLocaleDateString("id", {day:"numeric", month:"short", year:"numeric"})}</span> to
                                <span className="ml-2" >{new Date(this.state.markdown3List[0].end).toLocaleDateString("id", {day:"numeric", month:"short", year:"numeric"})}</span>
                                <table className="table-bordered mb-1" style={{width:"1000px"}} >
                                    <thead style={{backgroundColor:"#ffc61a"}} className="font-weight-bold">
                                        <td></td>
                                        <td className="p-2 text-center align-text-top" >Category</td>
                                        <td className="p-2 text-center align-text-top" >Brand</td>
                                        <td className="p-2 text-center align-text-top" >Name</td>
                                        <td className="p-2 text-center align-text-top" >Inventory</td>
                                        <td className="p-2 text-center align-text-top" >EA</td>
                                        <td className="p-2 text-center align-text-top" >Price (IDR)</td>
                                        <td className="p-2 text-center align-text-top" >Pic</td>
                                        <td className="p-2 text-center align-text-top" >Markdown by %</td>
                                        <td className="p-2 text-center align-text-top" >Markdown by IDR</td>
                                        <td className="p-2 text-center align-text-top" >Price after markdown</td>
                                    </thead>
                                    <tbody>
                                        {this.renderMarkdown3()}
                                        <tr>
                                            <td colSpan="11" className="text-right" >
                                                <Button className="m-1" onClick={()=>this.deleteMarkdown(3)} >Delete Markdown</Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            :
                            null
                        }
                        {
                            this.state.markdown4List.length>0
                            ?
                            <div>
                                <h5>Markdown 4</h5>
                                <span className="mr-2" >{new Date(this.state.markdown4List[0].start).toLocaleDateString("id", {day:"numeric", month:"short", year:"numeric"})}</span> to
                                <span className="ml-2" >{new Date(this.state.markdown4List[0].end).toLocaleDateString("id", {day:"numeric", month:"short", year:"numeric"})}</span>
                                <table className="table-bordered mb-1" style={{width:"1000px"}} >
                                    <thead style={{backgroundColor:"#ffc61a"}} className="font-weight-bold">
                                        <td></td>
                                        <td className="p-2 text-center align-text-top" >Category</td>
                                        <td className="p-2 text-center align-text-top" >Brand</td>
                                        <td className="p-2 text-center align-text-top" >Name</td>
                                        <td className="p-2 text-center align-text-top" >Inventory</td>
                                        <td className="p-2 text-center align-text-top" >EA</td>
                                        <td className="p-2 text-center align-text-top" >Price (IDR)</td>
                                        <td className="p-2 text-center align-text-top" >Pic</td>
                                        <td className="p-2 text-center align-text-top" >Markdown by %</td>
                                        <td className="p-2 text-center align-text-top" >Markdown by IDR</td>
                                        <td className="p-2 text-center align-text-top" >Price after markdown</td>
                                    </thead>
                                    <tbody>
                                        {this.renderMarkdown4()}
                                        <tr>
                                            <td colSpan="11" className="text-right" >
                                                <Button className="m-1" onClick={()=>this.deleteMarkdown(4)} >Delete Markdown</Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            :
                            null
                        }
                        {
                            this.state.markdown5List.length>0
                            ?
                            <div>
                                <h5>Markdown 5</h5>
                                <span className="mr-2" >{new Date(this.state.markdown5List[0].start).toLocaleDateString("id", {day:"numeric", month:"short", year:"numeric"})}</span> to
                                <span className="ml-2" >{new Date(this.state.markdown5List[0].end).toLocaleDateString("id", {day:"numeric", month:"short", year:"numeric"})}</span>
                                <table className="table-bordered mb-1" style={{width:"1000px"}} >
                                    <thead style={{backgroundColor:"#ffc61a"}} className="font-weight-bold">
                                        <td></td>
                                        <td className="p-2 text-center align-text-top" >Category</td>
                                        <td className="p-2 text-center align-text-top" >Brand</td>
                                        <td className="p-2 text-center align-text-top" >Name</td>
                                        <td className="p-2 text-center align-text-top" >Inventory</td>
                                        <td className="p-2 text-center align-text-top" >EA</td>
                                        <td className="p-2 text-center align-text-top" >Price (IDR)</td>
                                        <td className="p-2 text-center align-text-top" >Pic</td>
                                        <td className="p-2 text-center align-text-top" >Markdown by %</td>
                                        <td className="p-2 text-center align-text-top" >Markdown by IDR</td>
                                        <td className="p-2 text-center align-text-top" >Price after markdown</td>
                                    </thead>
                                    <tbody>
                                        {this.renderMarkdown5()}
                                        <tr>
                                            <td colSpan="11" className="text-right" >
                                                <Button className="m-1" onClick={()=>this.deleteMarkdown(5)} >Delete Markdown</Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            :
                            null
                        }
                        <Button className="my-3" href="/Listproduct">Back to List Product</Button>
                    </div>
                )
            default:
                return <Redirect to="/" />
        }
    }
}

const mapStateToProps = state => {
    return {
        loginRedux : state.login.user
    }
}

export default connect(mapStateToProps,{})(Markdown)