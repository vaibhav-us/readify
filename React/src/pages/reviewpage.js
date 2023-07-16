import React from "react";
import { 
    Link,
    Form ,
    useActionData,
    useLoaderData,
    useNavigate
} from "react-router-dom";
import { fullDate, getItems, postItems } from "../utility";
import {StarBlink} from "../components/ratingcomponents";
import InputMany from "../components/inputmany";

export async function loader({params}) {
    const  data = await getItems(`http://127.0.0.1:8000/book/${params.bookId}`)
    return data.data
}

export async function action({request}) {
    const formData = await request.formData()
    if (!formData.get("review")) return {emptyReview:"true"}

    const reviewData = {
        id      : formData.get("id"),
        review  : formData.get("review"),
        spoiler : formData.get("spoiler"),
        tags    : formData.getAll("tag").join(",")
    }
    console.log(reviewData);
    const res = await postItems(reviewData,`http://127.0.0.1:8000/${localStorage.getItem("id")}/book/${reviewData.id}/addreview/`)

    return res
}

export default function ReviewPage(props) {
    const data = useLoaderData()
    const actionData = useActionData()
    const navigate = useNavigate()

    React.useEffect(()=>{
        if(actionData?.message === "added") {
            navigate(-1)
        }
    },[actionData,navigate])

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
            <StarBlink bookId={data.id} className="reviewpage--rating"/>
            <br/><br/>

                <Form method="post" className="reviewform--container" replace>
                    <p>What do <i>you</i> think ?</p>
                    {actionData?.emptyReview && <i className="red">Write A Review Before Submitting It ! </i>}

                    <textarea className="review--area" name="review" placeholder="Write your Review (optional)"/>
                    <input name="spoiler" id="spoiler"  type="checkbox"/>
                    <label className="red" htmlFor="spoiler">Hide this review if it contains heavy spoilers!!</label><br/>
                    
                    <InputMany name="tag" desc="Add tags to summarize your review into words"/>

                    <input name="id" defaultValue={data.id} hidden />
                    <button className="reviewpage--sumbit">Post Your Review</button>
                </Form>
            
        </div>
    )
}