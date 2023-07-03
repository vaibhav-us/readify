import React from "react";
import { 
    useLocation,
    Link,
    Form ,
    useActionData
} from "react-router-dom";
import { fullDate, getCurrentDate } from "../utility";
import StarBlink from "../components/starblink";
import {nanoid} from "nanoid"

export async function action({request}) {
    const formData = await request.formData()
    if (!formData.get("review")) return {emptyReview:"true"}

    const date = getCurrentDate()

    const reviewData = {
        id      : formData.get("id"),
        review  : formData.get("review"),
        spoiler : formData.get("spoiler"),
        tags    : formData.getAll("tag"),
        date    : date
    }
    console.log(reviewData);
    return {submitted:true}
}

export default function ReviewPage(props) {
    const [data,setData] = React.useState({...useLocation().state,id:1,name:"The Name of the Wind",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1270352123i/186074.jpg",rating:5,author:"Patrick Rothfuss",date:"2015/06/23"}) 
    const actionData = useActionData()
    const submitted = actionData?.submitted || false

    const Tag = ({id}) => {
        function removeTag (id ){
            setTagInput( prev => 
                prev.length!==1 ? 
                    prev.filter(ele => ele.props.id!==id )   
                    :
                    prev    
            )
        }
        return(
            <span className="reviewpage--inputtags reviewpage--tag">
                <input className="searchbar--input" name="tag" placeholder="Enter a tag" />
                <span className="nobutton"  onClick={()=>removeTag(id)} ><b>X</b></span>
            </span>    
        )
    }

    const [tagInput,setTagInput] = React.useState([<Tag key={nanoid()} id={nanoid()} />])
    const addNewTag = () => {
        setTagInput(prev=>prev.concat(<Tag key={nanoid()} id={nanoid()} />))
    }
    

    return(
        <div className="reviewpage--container">
            <h1 className="reviewpage--container--heading">{data.name} &gt; Review</h1>

            <div className="searchtile reviewpage--book">
                <Link to={"/book/"+data.id}>
                    <img className="searchtile--img" src={data.image} alt=''/>
                </Link>
            
                <div className="searchtile--content">
                    <Link className="noLink searchtile--head" to={"/book/"+data.id}>
                        <big><b>{data.name} </b></big>
                    </Link>
                    <br/>
                    <i className="gray">{data.author}</i>
                    {data.date &&<p className="gray">Published on {fullDate(data.date)}</p>}
                </div>
            </div>

            <br/>
            <div className="reviewpage--rating">
                <StarBlink/>
            </div>
            <br/><br/>

            {submitted ?

                <div className="formsubmitted--container">
                    <h2>Your response has been submitted</h2>
                    <Link to={data.redirectTo}>
                        <button className="reviewpage--sumbit">Go Back &larr;</button>
                    </Link>
                </div>

                :

                <Form method="post" className="reviewform--container" replace>
                    <p>What do <i>you</i> think ?</p>
                    {actionData?.emptyReview && <i className="red">Write A Review Before Submitting It ! </i>}

                    <textarea className="review--area" name="review" placeholder="Write your Review (optional)"/>
                    <input name="spoiler" id="spoiler"  type="checkbox"/>
                    <label className="red" htmlFor="spoiler">Hide this review if it contains heavy spoilers!!</label><br/>
                    
                    <fieldset className="reviewpage--tag--container">
                        <legend className="reviewpage--tag">Tags</legend> 
                        {tagInput}
                        <span key={-1} onClick={addNewTag} className="reviewpage--moretag">
                            <big><b>+</b></big>
                        </span>
                    </fieldset>
                    <small className="gray">Add tags to summarize your review into words</small>

                    <input name="id" defaultValue={data.id} hidden />
                    <button className="reviewpage--sumbit">Post Your Review</button>
                </Form>
            }
            
        </div>
    )
}