import React from "react";
import { 
    Form ,
    useActionData,
    useLoaderData,
    useNavigate
} from "react-router-dom";
import {  isLogged, postItems, redirectIfNotLogged } from "../utility";
import InputMany from "../components/inputmany";
import { MediumSearchTile } from "../components/searchtile";

export async function loader({params,request}) {
    await redirectIfNotLogged(`/book/${params.bookId}/review`)

    const userid =(await isLogged())? localStorage.getItem("id") : 0
    const  data = await postItems({userid},`http://127.0.0.1:8000/book/${params.bookId}/`)
    
    var userReview ={data:[]}
    if (request.url.includes('edit')) {
        userReview =await postItems(
            {pageno:1,userid:localStorage.getItem('id'),getOneReview:1},
            `http://127.0.0.1:8000/book/${params.bookId}/review`
        )
    }
    
    return {data : data.data,userReview : userReview.data[0]}
}

export async function action({request}) {
    const formData = await request.formData()

    const reviewData = {
        id      : formData.get("id"),
        review  : formData.get("review"),
        spoiler : formData.get("spoiler"),
        tags    : formData.getAll("tag").join(",")
    }
    console.log(reviewData);
    const res = await postItems(reviewData,`http://127.0.0.1:8000/${localStorage.getItem("id")}/book/${reviewData.id}/addreview/`)
    console.log(`http://127.0.0.1:8000/${localStorage.getItem("id")}/book/${reviewData.id}/addreview/`);

    return res
}

export default function ReviewPage() {
    const {data,userReview} = useLoaderData()
    const actionData = useActionData()
    const navigate = useNavigate()

    React.useEffect(()=>{
        if(actionData?.message === "added" || actionData?.message === "updated") {
            navigate(-1)
        }
    },[actionData,navigate])

    return(
        <div className="reviewpage--container">
            <h1 className="reviewpage--container--heading">
                {data.name} &gt; Review {userReview && <>&gt; Edit</>}
            </h1>

            <div className="reviewpage--tile">
                <MediumSearchTile {...data} logged={true}/>    
            </div> <br/><br/>

            <Form method="post" className="reviewform--container" replace>
                <p>What do <i>you</i> think ?</p>

                <textarea 
                    className="review--area" 
                    name="review" 
                    placeholder="Write your Review (optional)" 
                    defaultValue={userReview?.review}    
                    required
                />
                <input name="spoiler" id="spoiler"  type="checkbox"/>
                <label className="red" htmlFor="spoiler">Hide this review if it contains heavy spoilers!!</label><br/>
                    
                <InputMany name="tag" desc="Add tags to summarize your review into words" initial={userReview} />

                <input name="id" defaultValue={data.id} hidden />
                <button className="reviewpage--sumbit">Post Your Review</button>
            </Form>
            
        </div>
    )
}