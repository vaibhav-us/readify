import React from "react";
import { Link, useLoaderData, useSearchParams} from 'react-router-dom';
import {ReviewButton, StarBlink, WantToRead} from "../components/ratingcomponents";
import RatingRatio from "../components/ratingratio";
import CollapseContainer from "../components/collapsecontainer";
import Slider from "../components/slider"
import Review from "../components/review"
import Paginate from "../components/paginate";
import SuchEmpty from "../components/suchempty";
import { fullDate, isLogged, postItems } from "../utility";
import Edit from "../components/edit";

export async function loader({params}) {
    const userid =(await isLogged())? localStorage.getItem("id") : 0
    const data = await postItems({userid},`http://127.0.0.1:8000/book/${params.bookId}/`)
    const logged = await isLogged()
    
    var review = {data:[]}
    if (logged){
        review =await postItems(
            {pageno:1,userid:localStorage.getItem("id"),getOneReview:1},
            `http://127.0.0.1:8000/book/${params.bookId}/review`
        )    
    }
    
    return {bookData : data.data, userReview : review.data[0], logged:logged}
}

export default function BookPage() {
    const searchparams = useSearchParams()[0]
    const reviewRef = React.useRef()
    const {bookData,userReview,logged} = useLoaderData()
    const [reviews,setReviews] = React.useState([])
    const [totalItems,setTotalItems] = React.useState(0)
    const [likedReview,setLikedReview] = React.useState([])

    console.log(userReview,logged);
    React.useEffect(()=>{ 
        async function call() {
            const userid =(await isLogged())? localStorage.getItem("id") : 0
            const pageno = searchparams.get("pageno") || 1

            const  reviewsdata =await postItems({pageno,userid},`http://127.0.0.1:8000/book/${bookData.id}/review`)
            setReviews(reviewsdata.data)
            setTotalItems(reviewsdata.totalCount)
            setLikedReview(reviewsdata.isLiked)
        }
        call()
    },[window.location.href,searchparams])

    const reviewSection = reviews.map(review => 
        <Review 
            key={review.id} 
            bookId={bookData.id} 
            likedReview={likedReview} 
            {...review}  
        />
    )
    return(
        <div className="bookpage--container">

            <div className="bookpage--sticky">
                <div className="bookpage--sticky--imgcontainer">
                    <img src={bookData.image} alt={bookData.name} width={"90%"}/>
                </div>
                <WantToRead bookId={bookData.id} logged={logged} />
                <StarBlink 
                    bookId={bookData.id} 
                    style={{maxWidth:"230px"}}
                    logged = {logged}
                />
            </div>

            <div className="bookpage--content">
                <h1>{bookData.name}</h1>
                <h2><i className="gray" >{bookData.author}</i></h2>

                <div className="bookpage--initialRate" onClick={()=>reviewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                    <RatingRatio rating={bookData.rating} />
                    <small className="gray">{bookData.reviewCount} reviews   </small>
                    <small className="gray">{bookData.ratingCount} ratings</small>
                </div>

                <CollapseContainer data={bookData.description} height={175}/>

                {(bookData.genre[0] || bookData.genre.length!==1) && 
                <>    
                    <span className="gray pre">Genres    </span>
                    {bookData.genre.map(ele => 
                        <Link 
                            key={ele} 
                            className="noLink review--point review--point--more"
                            to={"/search?genre="+ele.trim()}    
                        > {ele.trim()} </Link>
                    )}
                </>}

                <p className="gray">First published on {fullDate(bookData.publication)}</p>
                <hr/>

                <div>
                    <h2>Readers also enjoyed</h2>
                    < div style={{position: 'relative'}} >
                        <Slider postObject={{genre:bookData.genre[0].trim()}} api={`http://127.0.0.1:8000/searchbooks/`} logged={logged}/>
                    </div>
                </div>
                <hr/>

                {userReview && userReview.review
                ?   <>
                    <div className="your--review">
                        <h2>Your Review  </h2>
                        <Edit to={`/book/${bookData.id}/review`}/>    
                    </div>
                    
                    <Review
                        bookId={bookData.id} 
                        likedReview={likedReview} 
                        {...userReview} 
                    />
                    <hr/>
                    </>

                :   <>
                    <h2>Ratings & Reviews</h2>
                    <div className="rnr--container">
                        <h1>What do <i>you</i> think ?</h1>
                        <div className="rnr--links">
                            <StarBlink bookId={bookData.id} logged={logged}/>
                            <ReviewButton bookId={bookData.id}/>
                        </div>                       
                    </div> 
                    <br/><hr />
                    </>
                }

                <h2 ref={reviewRef}>Community Reviews</h2>
                {reviews && reviews.length!==0 
                ?   <>
                    {reviewSection}
                    <Paginate scrollRef={reviewRef} totalItems={totalItems} itemsPerPage={10} />
                    </>             
                :   <SuchEmpty msg={`Would you be so kind to be the first one to <a href="/book/${bookData.id}/review">Review</a>`}/>
                }
            </div>
        </div>
    )
}