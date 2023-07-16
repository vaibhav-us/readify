import React from "react";
import { Form, useActionData } from "react-router-dom";
import InputMany from "../components/inputmany";
import { ErrorMsg } from "./signup";
import { postItems } from "../utility";

export async function action ({request}) {
    const formData = await request.formData()
    var bookDetail = Object.fromEntries(formData)
    bookDetail = {
        ...bookDetail,
        image   :  formData.get("imageURL") || formData.get("image"),
        genres  :  formData.getAll("genre").join(",")
    }
    console.log(bookDetail);
    const res = await postItems(bookDetail,`http://127.0.0.1:8000/${localStorage.getItem("id")}/addbook/`)
    return res
}

export default function Contribute() {
    const [imageMethod,setImageMethod] = React.useState("url")
    const res = useActionData()
    localStorage.setItem("id",2)
    console.log(res);
    return(
        <Form className="contribute--container" method="post" replace>
            
            <div className="inputfield">
                <h1>Contribute To Us</h1>
            </div>

            <div className="inputfield">
                <label htmlFor="name">Title of the Book </label>
                <input className="contribute--input"  id="name" name="name" placeholder="short text" required/>
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
                    :   <>
                            <input  id="upload" name="image" type="file" accept="image/*" />
                            <ErrorMsg msg="Keep the size of the image 500kb or less" />
                            <ErrorMsg msg="Image should be at least have a height of 400 pixels" />
                        </> 
                    }      
                </div>

            </div>
            
            <div className="inputfield">
                <label htmlFor="author">Author</label>
                <input id="author" name="author" className="contribute--input" placeholder="short text"  required/>       
            </div>
            
            <div className="inputfield">
            <label htmlFor="publication">Publication date </label>
            <input id="publication" name="publication" type="date" className="contribute--input"  required />
            </div>

            <br/>
            <InputMany name="genre" desc="What is the book about?" className="inputfield--forgenre" required/>

            <textarea className="review--area inputfield" name="desc" placeholder="Small description about the book" required/>
            <br/>

            <button className="reviewpage--sumbit">Submit</button>
        </Form>
    )
}