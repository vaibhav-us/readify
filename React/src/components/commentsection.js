import React from "react";
import { getRelativeTime, isLogged, postItems } from "../utility";
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
                <small className="comment--date gray">{props.date && getRelativeTime(props.date)}</small>

                <CollapseContainer data={props.comment} height={60}/>
            </div>
        </div>
    )
} 
export function PopUp(props) {
    return(
        <div className="inputfield popup--container" style={props.style}>
            <h2>{props.msg}</h2>
            <button 
                className="reviewpage--sumbit" 
                onClick={props.onClick}
            > {props.button} </button>
        </div>
    )
}


export default function CommentSection (props) {
    const [textareaComment,setTextareaComment] = React.useState('')
    const [commentStatus,setCommentStatus] = React.useState('initial')
    const [comments,setComments] = React.useState([])
    const [isLoggedIn,setIsLoggedIn] = React.useState(false)

    React.useEffect(()=>{
        async function call() {
            const resData = await postItems({pageno:1},`http://127.0.0.1:8000/book/${props.bookId}/review/${props.reviewId}`)
            setIsLoggedIn(await isLogged())
            setComments(resData.comment)
        }
        call()
    },[commentStatus])

    const commentSection = comments.slice(0,4).map(ele => <Comment key={ele.id} {...ele}/>)

    const handleSubmit=async (e)=>{
        e.preventDefault()

        const res = await postItems(
            {comment:textareaComment},
            `http://127.0.0.1:8000/${localStorage.getItem("id")}/book/${props.bookId}/review/${props.reviewId}/addcomment`
        )
        setCommentStatus(res.message==="addded"?'added':commentStatus)
    }

    return(
        <div>
            <div className="line--dec">
                <hr className="login--hr"/>
                {comments.length >= 5 &&
                <Link 
                    to={`review/${props.reviewId}`}
                    className="login--newto gray comment--link noLink"
                > <small>Show all comments</small> </Link>}
            </div>

            { commentSection}

            {isLoggedIn && commentStatus ==='initial' && 

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
                    <button 
                        className="comment--post" 
                        hidden={textareaComment===''}
                    > Post</button>   
                </div>
            </form>
            }   

            {commentStatus === "added" &&
                <PopUp 
                    msg="Your comment has been submitted" 
                    button="OK" 
                    onClick={()=>setCommentStatus("confirmed")} 
                />
            }
            <br/><hr/>
        </div>     
    )
}