import React from "react";
import { useActionData, useNavigate,Link, Form, useLoaderData, useParams, useSearchParams } from "react-router-dom";
import { fullDate, getItems, isLogged, postItems } from "../utility";
import RatingRatio from "../components/ratingratio";
import { Comment } from "../components/commentsection";
import Paginate from "../components/paginate";
import SuchEmpty from "../components/suchempty"

export async function loader({params}) {
    const userid =(await isLogged())? localStorage.getItem("id") : 0
    const book = await postItems({userid},`http://127.0.0.1:8000/book/${params.bookId}/`)
    const  review =await postItems(
        {pageno:1,userid:params.reviewId,getOneReview:1},
        `http://127.0.0.1:8000/book/${params.bookId}/review`
    )

    return {
        book       : book.data,
        review     : review.data[0]
    }
}

export async function action({request,params}) {
    const formData = await request.formData()
    const res = await postItems(
         Object.fromEntries(formData),
        `http://127.0.0.1:8000/${localStorage.getItem("id")}/book/${params.bookId}/review/${params.reviewId}/addcomment`
    )
    return {comment:res.message}
}

export default function ReviewSection() {
    const navigate = useNavigate()
    const params = useParams()
    const searchparams = useSearchParams()[0]
    const [writeComment,setWriteComment] = React.useState('initial')
    const commentRef = React.useRef(null)
    const {book,review} = useLoaderData() 
    const [commentsData,setCommentsData] = React.useState({comments:[],totalItems:0})
    const actionData = useActionData()
    // <button onClick={()=>navigate(-1)}>go back</button>

    //go to top
    const [showGoToTop, setShowGoToTop] = React.useState(false);
    React.useEffect(() => {
        async function call() {
            const pageno = searchparams.get("pageno") || 1
            const  res =await postItems({pageno},`http://127.0.0.1:8000/book/${params.bookId}/review/${params.reviewId}`)
            setCommentsData({comments:res.comment,totalItems:res.totalCount})
            console.log(res);
        }
        call()

        setWriteComment(actionData?.comment || writeComment)
        const handleScroll = () => {
            setShowGoToTop(800 < window.scrollY? true: false)
        };
        window.addEventListener('scroll', handleScroll)
        
        return () => window.removeEventListener('scroll', handleScroll); 
    }, [actionData,searchparams]);
    
    
    const theComments = commentsData.comments.map(ele => <Comment key={ele.id} {...ele}/>)
    return(
        <div >
            <div className="reviewsection--container">
                <h2 className="reviewpage--container--heading">{review.name}'s Review &gt; {book.name}</h2>

                <Link className="noLink searchtile--head" to={"/book/"+book.id}>
                    <big><b>{book.name} </b></big>
                </Link>
                <br/>
                <i className="gray">{book.author}</i>

                <div className="searchtile">

                    <Link to={"/book/"+book.id}>
                        <img className="searchtile--img reviewsection--img" src={book.image} alt=''/>
                    </Link>

                    <div >
                        <span>{review.name}'s review - </span>
                        {review.date &&<small className="gray">Reviewed on {fullDate(review.date)}</small>}
                        
                        <div style={{height:"25px"}}>
                            <RatingRatio rating={review.rating} />
                        </div>

                        {/* {review.tags.map(ele=><small className="review--point" key={ele}>{ele}</small>)} */}
                    </div>
                </div>

                <div className="bookdesc--container">
                    {review.review}
                </div>
                <br/><br/><hr/>

                {commentsData.comments.length !== 0
                ?   <>
                        <div ref={commentRef}>
                            {theComments}
                        </div>
                        <Paginate scrollRef={commentRef} totalItems={commentsData.totalItems} itemsPerPage={10}/>
                    </>
                :   <SuchEmpty msg="Be the first one to comment "/>
                }
            </div>

            <div className="navigators">
                <button 
                    className="rnr--links--review navigators--links"
                    style={writeComment==="initial"?{}:{display:"none"}} 
                    onClick={()=>setWriteComment("write")}
                >  Post a comment  </button>
              
                <button 
                    className="navigator--top navigators--links"
                    style={showGoToTop?{}:{display:"none"}} 
                    onClick={()=>commentRef.current.scrollIntoView({block:"start"})}
                >  Go to Top &uarr;  </button>
            </div>

            
            {writeComment==="write" &&
                <Form method="post" className="reviewsection--commentinput--container">
                    <textarea 
                        name="comment"
                        className="reviewsection--commentinput"
                        placeholder="Add a comment"
                    />
                    <button className="rnr--links--review reviewsection--commentinput--post">  Post   </button>
                </Form>
            }
        </div>  
    )
}