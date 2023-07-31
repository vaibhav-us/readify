import React from "react";
import { Form, useActionData, useNavigate } from "react-router-dom";
import InputMany from "../components/inputmany";
import { ErrorMsg } from "./auth";
import { postItems } from "../utility";

export async function action ({request}) {
    const formData = await request.formData()
    var bookDetail = Object.fromEntries(formData)

    // const image = new FileReader();
    // image.readAsDataURL(new Blob([formData.get("image")],{type:"image/*"}));
    // console.log(image,formData.get("image").files[0]);
    bookDetail = {
        ...bookDetail,
        name    :  formData.get("name").trim(),
        author  :  formData.get("author").trim(),
        image   :  formData.get("imageURL") || formData.get("image"),
        genres  :  formData.getAll("genre").join(",")
    }
    console.log(bookDetail);
    const res = await postItems(bookDetail,`http://127.0.0.1:8000/${localStorage.getItem("id")}/addbook/`)
    return res
    // return null
}

export default function Contribute() {
    const [formData,setFormData] = React.useState({name: '', author: ''})
    const [imageMethod,setImageMethod] = React.useState("url")
    const [imgValid,setImgValid] = React.useState({size:'',height:''})
    const imgRef = React.useRef()
    const res = useActionData()
    const navigate = useNavigate()

    React.useEffect( () => {
        async function call() {
            const res = await postItems(formData,"http://127.0.0.1:8000/isbook/")
            setFormData(prev => ({...prev,exist:res.exist}))
        }
        call()
    },[formData.name,formData.author])

    const handleChange= (e) => {
        setFormData(prev => ({...prev,[e.target.name] : e.target.value.trim()}))
    }
   
    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (!file){
            setImgValid({size:'',height:''})
            imgRef.current.src=""
            return
        } 

        setImgValid(prev=>({
            ...prev,
            size:(file.size <= 100 * 1024)?1:0
        }))
            
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            imgRef.current.src = e.target.result 
            setImgValid(prev=>({
                ...prev,
                height:(imgRef.current.naturalHeight >= 400)?1:0
            }))  
        }  
    }

    return(
        res?.message!=="added successfully" ?

        <Form className="contribute--container" method="post" replace>
            
            <div className="inputfield contribute--header">
                <h1>Contribute To Us</h1>
            </div>

            <div className="inputfield">
                <label htmlFor="name">Title of the Book </label>
                <input 
                    className="contribute--input"  
                    id="name" name="name" 
                    placeholder="short text" 
                    onChange={handleChange}
                    required
                />
                {formData.exist !==0 && formData.exist &&
                  <ErrorMsg msg="The book with same author is with us" condition={formData.exist && 0}/>} 
            </div>

            <div className="inputfield">
                <div className="contribute--imgselectors">
                {["url","upload"].map(ele=>(
                    <span key={ele} className={`contribute--img--decorate${ele===imageMethod ? " contribute--img--decorateACTIVE":"" }`}>
                        <button
                            type="button"
                            className="contribute--img--selector" 
                            htmlFor={ele} 
                            onClick={()=>setImageMethod(ele)}
                            style={ele===imageMethod?{backgroundColor: "#dfe165"}:{}}
                        >{ele==="url"? "Load Cover Image URL":"Upload Cover Image"} </button>
                    </span>
                ))}
                </div>
            
                
                <div className="contribute--imgsection">
                    {imageMethod==="url"
                    ?   <input className="contribute--input"  id="url" name="imageURL" placeholder="Insert URL here"/> 
                    :   <div className="contribute--imgsection--upload">
                            <div>
                                <input  
                                    id="upload" 
                                    name="image" 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageChange} 
                                /> <br/><br/>
                                <ErrorMsg msg="Keep the size of the image 100kb or less" condition={imgValid.size}/>
                                <ErrorMsg msg="Image should be at least have a height of 400 pixels" condition={imgValid.height}/>
                            </div>
                            <div className="img--preview">
                                {imgRef.current?.src && <span>Preview</span>}
                                <img ref={imgRef} className="searchtile--img"/>
                            </div>
                        </div> 
                    }      
                </div>

            </div>
            
            <div className="inputfield">
                <label htmlFor="author">Author</label>
                <input 
                    id="author" name="author" 
                    className="contribute--input" 
                    placeholder="short text"  
                    onChange={handleChange}
                    required
                />  
                {formData.exist !==0 && formData.exist &&
                  <ErrorMsg msg="The book with same author is with us" condition={formData.exist && 0}/>} 
            </div>
            
            <div className="inputfield">
            <label htmlFor="publication">Publication date </label>
            <input id="publication" name="publication" type="date" className="contribute--input"  required />
            </div>

            <br/>
            <InputMany name="genre" desc="What is the book about?" className="inputfield--forgenre" required/>

            <textarea className="review--area inputfield" name="desc" placeholder="Small description about the book" required/>
            <br/>

            <button 
                className="reviewpage--sumbit"
                disabled={imgValid.height===0 || imgValid.size===0 || formData.exist}
            > Submit </button>
        </Form>

        :

        <div className="inputfield contribute--container contribute--header">
            <h1>Thank You For Your Contribution</h1>
            <div className="contributeSub--buttons">
                <button className="reviewpage--sumbit" onClick={()=>navigate(-1)}>Go Back</button>
                <button className="reviewpage--sumbit" onClick={()=>navigate(0)}>Add another Book</button>    
            </div>
            
        </div>
    )
}