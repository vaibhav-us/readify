import React from "react";
import { Link, useLoaderData, useSearchParams} from 'react-router-dom';
import {ReviewButton, StarBlink, WantToRead} from "../components/ratingcomponents";
import RatingRatio from "../components/ratingratio";
import CollapseContainer from "../components/collapsecontainer";
import Slider from "../components/slider"
import Review from "../components/review"
import Paginate from "../components/paginate";
import SuchEmpty from "../components/suchempty";
import { fullDate, getItems, postItems } from "../utility";

export async function loader({params}) {
    const data = await getItems(`http://127.0.0.1:8000/book/${params.bookId}`)
    return {bookData   : data.data}
}

export default function BookPage() {
    const searchparams = useSearchParams()[0]
    const reviewRef = React.useRef()
    const {bookData} = useLoaderData()
    const [reviews,setReviews] = React.useState([])
    const [totalItems,setTotalItems] = React.useState(0)

    React.useEffect(()=>{ 
        async function call() {
            const pageno = searchparams.get("pageno") || 1
            const  reviewsdata =await postItems({pageno},`http://127.0.0.1:8000/book/${bookData.id}/review`)
            setReviews(reviewsdata.data)
            setTotalItems(reviewsdata.totalCount)
        }
        call()
    },[window.location.href,searchparams])

    const reviewSection = reviews.map(review => 
         <Review key={review.id} {...review} />
    )
    // dataForReviewPage must be an object containing bookId,title,author,imageurl,year(optional)
    const msgForSuchEmpty = { __html: `Would you be so kind to be the first one to Review`}

    return(
        <div className="bookpage--container">

            <div className="bookpage--sticky">
                <div className="bookpage--sticky--imgcontainer">
                    <img src={bookData.image} alt={bookData.name} width={"90%"}/>
                </div>
                <WantToRead bookId={bookData.id} />
                <StarBlink bookId={bookData.id} style={{maxWidth:"230px"}}/>
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

                <span className="gray">Genres   </span>
                {bookData.genre.map(ele => 
                    <Link 
                        key={ele} 
                        className="noLink review--point review--point--more"
                        to={"/search?genre="+ele.trim()}    
                    > {ele} </Link>
                )}

                <p className="gray">First published on {fullDate(bookData.publication)}</p>
                <hr/>

                <div>
                    <h2>Readers also enjoyed</h2>
                    < div style={{position: 'relative'}} >
                        <Slider postObject={{genre:bookData.genre[0].trim()}} api={`http://127.0.0.1:8000/searchbooks/`} />
                    </div>
                </div>
                <hr/>

                <h2>Ratings & Reviews</h2>
                <div className="rnr--container">
                    <h1>What do <i>you</i> think ?</h1>
                    <div className="rnr--links">
                        <StarBlink bookId={bookData.id}/>
                        <ReviewButton bookId={bookData.id}/>
                    </div>                       
                </div> 
                <br/><hr />

                <h2 ref={reviewRef}>Community Reviews</h2>
                {reviews && reviews.length!==0 
                ?   <>
                    {reviewSection}
                    <Paginate scrollRef={reviewRef} totalItems={totalItems} itemsPerPage={10} />
                    </>             
                :   <SuchEmpty msg={msgForSuchEmpty}/>
                }
            </div>
        </div>
    )
}