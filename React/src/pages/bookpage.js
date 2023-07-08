import React from "react";
import { useLoaderData, useParams} from 'react-router-dom';
import {ReviewButton, StarBlink, WantToRead} from "../components/ratingcomponents";
import RatingRatio from "../components/ratingratio";
import CollapseContainer from "../components/collapsecontainer";
import Slider from "../components/slider"
import Review from "../components/review"
import Paginate from "../components/paginate";
import SuchEmpty from "../components/suchempty";
import { fullDate, getItems } from "../utility";

export async function loader({params}) {
    const reviews = [
        {id:1,name:"Ian",review:"As an avid adult fantasy reader, out of all the books that I’ve been recommended, The Name of the Wind has always been recommended to me the most. Google, Goodreads, book reviewing sites, 9gag, even some people who don't read a lot of fantasy books, they",rating:"4",date:"2011/02/20",tags:["fantasy","masterpiece","recommended","likable","yes"],likes:1000,comments:500,spoiler:true},
        {id:2,name:"Petrik",review:"This is why I love fantasy so much. After a recent string of okay fantasy novels, a couple of good ones but nothing to get really excited about, I've rediscovered my passion thanks to this book.\n\n I'm so impressed, and so in love, I can't begin to describe it. But I can try to give you a feel for the book, if I can figure out where to start and how to do justice to this masterpiece.Kvothe (pronounced like 'Quothe') is a world-renowned figure of mystery with a disreputable reputation - a hero or a demon depending on which stories you hear. The real man has hidden himself away at an inn in the middle of nowhere with his apprentice Bast - we know not why - and it's not until the Chronicler discovers him there that he shows any interest in reliving his past life. Insisting that his story will take three days to tell, and that the famous chronicler must write it down exactly as he tells it, he begins to share his story: a child genius growing up with his parents' troupe, performing plays and tricks across the land while being taught 'sympathy' (magic), history, chemistry etc. by a tinker, Abenthy, who had been to the University; to ending up homeless and penniless on the streets of Treban, a big port city. It's not until he's fifteen that he makes it to the University, and is accepted, though he's three years younger than is usual. Abenthy has taught him well, and combined with his impressive memory, natural talent, quick intelligence and training, he moves quickly up the ranks of the university.",rating:"5",date:"2022/04/10",tags:["masterpiece","fantasy","recommended"],likes:1000,comments:500},
        {id:3,name:"stan",review:"It's a well known fact that I will read pretty much any book with a magical school but so is the fact that I don't like waiting for the next book in a series.",rating:"2",date:"2012/05/20",tags:["waste-of-money","sucks","fantasy"],likes:1000,comments:500,spoiler:true},
        {id:4,name:"Link",review:" I thought the book sucked. My thinking the book sucked in no way impacts how much others enjoyed the book. And if you are uncomfortable that I point out the lack of strong female characters, the main character as essentially a male Mary Sue, or the fact that the entire book was pure male fantasy wish fulfillment,",rating:"1",date:"2002/09/1",likes:1000,comments:500},
        {id:5,name:"Son",review:"In a small town is an innkeeper named Kote, living a quiet life, when one day a man enters his establishment looking for Kvothe, the man of myths and legends.",rating:"3",date:"2022/07/9",tags:["waste-of-money","fantasy"],likes:1000,comments:500,spoiler:true},
        {id:6,name:"Ron",review:"I really, really wish I could give this negative stars.",rating:"2",date:"2021/05/10",tags:["waste-of-money","fantasy","sucks"],likes:1000,comments:500}
    ]
    const  data = await getItems(`http://127.0.0.1:8000/book/${params.bookId}`)
    return {reviews,bookData:data.data}
}

export default function BookPage() {
    const reviewRef = React.useRef()
    const {reviews,bookData} = useLoaderData()
    console.log(bookData,bookData.description);

    //dummy data
    const sliderData = [
        {id:1,name:"The Name of the Wind",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1270352123i/186074.jpg",rating:5,author:"Patrick Rothfuss"},
        {id:2,name:"The Way of Kings",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1659905828i/7235533.jpg",rating:5,author:"Brandon Sanderson"},
        {id:3,name:"The Eye of the World",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1659905815i/228665.jpg",rating:5,author:"Robert Jordan"},
        {id:4,name:"A Game of Thrones",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1562726234i/13496.jpg",rating:5,author:"George R R Martin"},
        {id:5,name:"The Art of The Fellowship of the Ring",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1347803870i/119.jpg",rating:5,author:"Gary Russell"},
        {id:6,name:"The Lord of the Rings: The Making of the Movie Trilogy",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1389501592i/7351.jpg",rating:5,author:"Brian Sibley"},
        {id:7,name:"The Lord of the Rings: Weapons and Warfare",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388290346i/36.jpg",rating:5,author:"christopher lee"}
    ]
    
    const reviewSection = reviews.map(review => <Review key={review.id} {...review} />)
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
                {bookData.genre.map(ele => <b key={ele} className="review--point">{ele}</b>)}

                <p className="gray">First published on {fullDate(bookData.publication)}</p>
                <hr/>

                <div>
                    <h2>Readers also enjoyed</h2>
                    < div style={{position: 'relative'}} >
                        <Slider data={sliderData} />
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
                {reviews && reviews.length!==0 ?
                    <>
                    {reviewSection}
                    <Paginate scrollRef={reviewRef} totalItems={500} itemsPerPage={10} />
                    </>
                    :
                    <SuchEmpty msg={msgForSuchEmpty}/>
                }
            </div>
        </div>
    )
}