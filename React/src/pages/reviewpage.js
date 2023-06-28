import React from "react";
import { 
    useLocation,
    Link,
    Form ,
    useActionData
} from "react-router-dom";
import { fullDate } from "../utility";
import StarBlink from "../components/starblink";

export async function action({request}) {
    const formData = await request.formData()
    if (!formData.get("review")) return {emptyReview:"true"}

    console.log(formData.get("review"),formData.get("spoiler"));
    return null
}
export function loader({request}) {
    return null
}

export default function ReviewPage(props) {
    let data = useLocation().state
    const actionData = useActionData()

    //dummy data
    data = {id:1,name:"The Name of the Wind",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1270352123i/186074.jpg",rating:5,author:"Patrick Rothfuss",date:"2015/06/23"}

    return(
        <div className="reviewpage--container">
            <h1>{data.name} &gt; Review</h1>

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

            <Form method="post" className="reviewform--container" replace>
                <p>What do <i>you</i> think ?</p>
                {actionData?.emptyReview && <i className="red">Maybe Write A Review Before Submitting It ? </i>}

                <textarea className="review--area" name="review" placeholder="Write your Review (optional)"/>
                <input name="spoiler" id="spoiler"  type="checkbox"/>
                <label className="red" htmlFor="spoiler">Hide this review if it contains heavy spoilers!!</label><br/>
                <button>Submit Your Review</button>
            </Form>
            
        </div>
    )
}