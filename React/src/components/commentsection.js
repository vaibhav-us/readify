import React from "react";
import { getRelativeTime } from "../utility";
import CollapseContainer from "./collapsecontainer";
import { Link } from "react-router-dom";

export function Comment (props) {
    return(
        <div className="comment--container">
            <div>
                {/* a profile image? */}
            </div>

            <div>
                <b>{props.name}</b> 
                <small className="comment--date gray">{getRelativeTime(props.date)}</small>

                <CollapseContainer data={props.comment} height={60}/>
            </div>
        </div>
    )
} 

export default function CommentSection (props) {
    const [textareaComment,setTextareaComment] = React.useState('')
    const [comments,setComments] = React.useState([])
    React.useEffect(()=>{
        //dummy data
        setComments([
            {id:1,name:"Zack",comment:`Your review sounds like you are desperately looking for things to hate about this book. Multiple paragraphs about how you were bothered by a failure to adequately distinguish between third-person objective and third-person subjective? I’ve read this book twice, and it doesn’t do anything unprecedented for its genre. Third-person objective and third-person subjective is a framework for how we look at literature retrospectively, but there are no ironclad rules about what you can or can’t put on a page. It was always clear what he was talking about and what was intended, so if you were bothered by it… skill issue. I don’t think you were bothered by it, though. I think you were bothered by something else, some thing that you know is not a valid criticism, so you were looking for things that do feel like valid criticisms. My best guess, it rubbed you the wrong way just how much people hype up this book, and you went in with a mindset that they couldn’t be right. Everything good about it was diminished in your eyes and whatever minute issues you found would be magnified. That is not the only conceivable explanation for why you would so strangely fixate on the most inane sticking points, but to me it seems the most likely.`,date:"2023/05/20"},
            {id:2,name:"yoly",comment:"came here for comments by haters of haters - was not disappointed! I liked your review. I for one also struggle with these larger-than-life works of fantasy that are so larger than life that they become overwrought and tiresome. Anyway, nice critique.",date:"2023/06/20"},
            {id:3,name:"Dan",comment:"Lol but you gave catching fire 4 stars. It really looks like you just wanted to start an argument? And you enjoy your own words. For months you argued with others on here...wow",date:"2023/06/19"},
            {id:4,name:"Manuel",comment:"At least in my library this book is under YA. I did not realized that until I had finish the book. I’m sure I would have enjoyed this book when I was younger. Reading it",date:"2020/01/01"},
        ])
    },[])

    const commentSection = comments.map(ele => <Comment key={ele.id} {...ele}/>)

    const handleSubmit=(e)=>{
        e.preventDefault()
        console.log(textareaComment);
    }

    return(
        <div>
            <div className="line--dec">
                <hr className="login--hr"/>
                <Link 
                    to={`review/${props.id}`}
                    className="login--newto comment--link noLink"
                > Show all comments </Link>
            </div>
            { commentSection}
            <form className="comment--container" onSubmit={handleSubmit}>
                <div>{/* <img/> */}</div>
                <div className="comment--input--container">
                    <textarea  
                        className="comment--input" 
                        type="text" 
                        name="comment" 
                        placeholder="Add a comment"
                        value={textareaComment}                                    
                        onChange={(e)=>setTextareaComment(e.target.value)}
                        autoFocus
                    />
                    <button className="comment--post" hidden={textareaComment===''}>Post</button>   
                </div>
            </form>    
        </div>     
    )
}