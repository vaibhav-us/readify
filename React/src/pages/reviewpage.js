import React from "react";
import { 
    Link,
    Form ,
    useActionData,
    useLoaderData
} from "react-router-dom";
import { fullDate, getItems, postItems } from "../utility";
import {StarBlink} from "../components/ratingcomponents";
import {nanoid} from "nanoid"

export async function loader({params}) {
    const  data = await getItems(`http://127.0.0.1:8000/book/${params.bookId}/`)
    return data.data
}

export async function action({request}) {
    const formData = await request.formData()
    if (!formData.get("review")) return {emptyReview:"true"}

    const reviewData = {
        id      : formData.get("id"),
        review  : formData.get("review"),
        spoiler : formData.get("spoiler"),
        tags    : formData.getAll("tag")
    }
    console.log(reviewData);
    const res = await postItems(reviewData,"http://127.0.0.1:8000/1/book/1/addreview/")

    
    return {submitted:true}
}

export default function ReviewPage(props) {
    const data = useLoaderData()
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

            <div className="searchtile">
                <Link to={"/book/"+data.id} className="reviewpage--img">
                    <img className="searchtile--img" src={data.image} alt=''/>
                </Link>
            
                <div className="searchtile--content">
                    <Link className="noLink searchtile--head" to={"/book/"+data.id}>
                        <big><b>{data.name} </b></big>
                    </Link>
                    <br/>
                    <i className="gray">{data.author}</i>
                    {data.publication &&<p className="gray">Published on {fullDate(data.publication)}</p>}
                </div>
            </div>

            <br/>
            <StarBlink className="reviewpage--rating"/>
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