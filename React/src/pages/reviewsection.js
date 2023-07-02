import React from "react";
import { useActionData, useNavigate,Link, Form } from "react-router-dom";
import { fullDate } from "../utility";
import RatingRatio from "../components/ratingratio";
import { Comment } from "../components/commentsection";
import Paginate from "../components/paginate";

export async function action({request}) {
    const formData = await request.formData()
    console.log(formData.get("comment"));
    return {comment:"written"}
    return null
}
export default function ReviewSection() {
    const navigate = useNavigate()
    const [writeComment,setWriteComment] = React.useState('initial')
    const commentRef = React.useRef(null)
    const actionData = useActionData()
    // <button onClick={()=>navigate(-1)}>go back</button>

    //go to top
    const [showGoToTop, setShowGoToTop] = React.useState(false);
    React.useEffect(() => {
        setWriteComment(actionData?.comment || writeComment)
        console.log(writeComment);
        const handleScroll = () => {
            setShowGoToTop(400 < window.scrollY? true: false)
        };
        window.addEventListener('scroll', handleScroll)
        
        return () => window.removeEventListener('scroll', handleScroll); 
    }, [actionData]);
    //dummy data
    const book = {id:1,name:"The Name of the Wind",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1270352123i/186074.jpg",rating:5,author:"Patrick Rothfuss",date:"2022/10/02"}
    const review = {id:2,name:"Petrik",review:"This is why I love fantasy so much. After a recent string of okay fantasy novels, a couple of good ones but nothing to get really excited about, I've rediscovered my passion thanks to this book. I'm so impressed, and so in love, I can't begin to describe it. But I can try to give you a feel for the book, if I can figure out where to start and how to do justice to this masterpiece.Kvothe (pronounced like 'Quothe') is a world-renowned figure of mystery with a disreputable reputation - a hero or a demon depending on which stories you hear. The real man has hidden himself away at an inn in the middle of nowhere with his apprentice Bast - we know not why - and it's not until the Chronicler discovers him there that he shows any interest in reliving his past life. Insisting that his story will take three days to tell, and that the famous chronicler must write it down exactly as he tells it, he begins to share his story: a child genius growing up with his parents' troupe, performing plays and tricks across the land while being taught 'sympathy' (magic), history, chemistry etc. by a tinker, Abenthy, who had been to the University; to ending up homeless and penniless on the streets of Treban, a big port city. It's not until he's fifteen that he makes it to the University, and is accepted, though he's three years younger than is usual. Abenthy has taught him well, and combined with his impressive memory, natural talent, quick intelligence and training, he moves quickly up the ranks of the university.",rating:"5",date:"2022/04/10",tags:["masterpiece","fantasy","recommended"],likes:1000,comments:500}
    const comments = [
        {id:1,name:"Zack",comment:`Your review sounds like you are desperately looking for things to hate about this book. Multiple paragraphs about how you were bothered by a failure to adequately distinguish between third-person objective and third-person subjective? I’ve read this book twice, and it doesn’t do anything unprecedented for its genre. Third-person objective and third-person subjective is a framework for how we look at literature retrospectively, but there are no ironclad rules about what you can or can’t put on a page. It was always clear what he was talking about and what was intended, so if you were bothered by it… skill issue. I don’t think you were bothered by it, though. I think you were bothered by something else, some thing that you know is not a valid criticism, so you were looking for things that do feel like valid criticisms. My best guess, it rubbed you the wrong way just how much people hype up this book, and you went in with a mindset that they couldn’t be right. Everything good about it was diminished in your eyes and whatever minute issues you found would be magnified. That is not the only conceivable explanation for why you would so strangely fixate on the most inane sticking points, but to me it seems the most likely.`,date:"2023/05/20"},
        {id:2,name:"yoly",comment:"came here for comments by haters of haters - was not disappointed! I liked your review. I for one also struggle with these larger-than-life works of fantasy that are so larger than life that they become overwrought and tiresome. Anyway, nice critique.",date:"2023/06/20"},
        {id:3,name:"Dan",comment:"Lol but you gave catching fire 4 stars. It really looks like you just wanted to start an argument? And you enjoy your own words. For months you argued with others on here...wow",date:"2023/06/19"},
        {id:4,name:"Manuel",comment:"At least in my library this book is under YA. I did not realized that until I had finish the book. I’m sure I would have enjoyed this book when I was younger. Reading it",date:"2020/01/01"},
    ]  
    
    const theComments = comments.map(ele => <Comment key={ele.id} {...ele}/>)
    return(
        <div >
            <h2 className="reviewpage--container--heading">{review.name}'s Review &gt; {book.name}</h2>

            <div className="reviewsection--container">
                <Link className="noLink searchtile--head" to={"/book/"+book.id}>
                    <big><b>{book.name} </b></big>
                </Link>
                <br/>
                <i className="gray">{book.author}</i>

                <div className="searchtile">

                    <Link to={"/book/"+book.id}>
                        <img className="searchtile--img" src={book.image} alt=''/>
                    </Link>

                    <div >
                        <span>{review.name}'s review - </span>
                        {review.date &&<small className="gray">Reviewed on {fullDate(review.date)}</small>}
                        
                        <div style={{height:"25px"}}>
                            <RatingRatio rating={review.rating} />
                        </div>

                        {review.tags.map(ele=><small className="review--point" key={ele}>{ele}</small>)}
                    </div>
                </div>

                <div className="bookdesc--container">
                    {review.review}
                </div>
                <br/><br/><hr/>

                <div ref={commentRef}>
                    {theComments}
                </div>
                <Paginate scrollRef={commentRef} totalItems={100} itemsPerPage={10}/>
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