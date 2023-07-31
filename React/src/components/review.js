import React from "react";
import CollapseContainer from "./collapsecontainer";
import { approximate, expand, fullDate, isLogged, postItems } from "../utility";
import RatingRatio from "./ratingratio";
import CommentSection from "./commentsection";
import { Form, useLocation, useNavigate } from "react-router-dom";

const Review = (props) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [like,setLike] = React.useState(props.likedReview.includes(props.id))
    const [displayLikeCount,setDisplayLikeCount] = React.useState(approximate(props.likes))
    const [showMore,setShowMore] = React.useState(false)
    const [displaySpoiler,setDisplaySpoiler]=React.useState(props.spoiler==="on" ?true : false)
    const [displayComment,setDisplayComment]=React.useState(false)

    async function handleLikeSubmit (){
        if (! await isLogged()){
            navigate(`/auth?redirectTo=${location.pathname}&msg=You Must Be Logged In First`)
            return
        }

        const res = await postItems(
            {isliked:like},
            `http://127.0.0.1:8000/${localStorage.getItem("id")}/${props.id}/like`
        )
        console.log(res,props.id);
    }

    function handleLikeClick() {
        setLike(!like)
  
        setDisplayLikeCount(prev =>{
            if (like) return approximate(expand(prev)-1)
            else return approximate(expand(prev)+1)
        })
    }
    async function handleCommentClick () {
        if (!await isLogged())
            navigate(`/auth?redirectTo=${location.pathname}&msg=You Must Be Logged In First`)
        setDisplayComment(true)
    }

    const SpoilerTag = () => {
        return(
            <div className="review--spoiler red">
                <h3 >Review Contains Spoilers!!!</h3>
                <button 
                    className="review--spoiler--button"
                    onClick={()=>setDisplaySpoiler(false)}
                >  &gt; </button>
            </div>
        )
    }         
    
    function toggleShowMore() {
        setShowMore(!showMore)
    }

    const displayTags = props.tags?.slice(0,3).map(tag => <b key={tag} className="review--point">{tag}</b>) || []
    displayTags.push(
        props.tags && props.tags[3] ? 
            showMore ?
            props.tags.slice(3).map(tag => <b key={tag} className="review--point">{tag}</b>) 
            :
            <b key='more' className="review--point--more" onClick={toggleShowMore}>...more</b>
        :
            null
    )
    const likeImage = like? '/images/liked.png' : "/images/like.png"

    return(
        <div className="review--container">
            <div>
                <big><h3>{props.name}</h3></big>
                <p>{ fullDate(props.date) }</p>
            </div>

            <div>
                {props.rating 
                ?   <div className="review--starrate">
                        <RatingRatio rating={props.rating} />
                    </div>
                :   <></>}

                { displaySpoiler
                ?   <SpoilerTag/>
                :   <CollapseContainer data={props.review} height={100}/>  }

                {(props.tags[0] || props.tags.length!==1) &&
                <div>{displayTags}<br/><br/></div> }

                <div className="review--likeNcomment">
                    <Form onSubmit={handleLikeSubmit}>
                        <button  className="nobutton" onClick={handleLikeClick} >
                            <img  src={process.env.PUBLIC_URL+likeImage} alt="" width={"20px"} />
                            <b>  {like? "Liked":"Like"} </b>
                        </button>
                        <small className="likeNcommentcount">{displayLikeCount}</small>    
                    </Form>

                    <div>
                        <button className="nobutton" onClick={handleCommentClick}>
                            <img src={process.env.PUBLIC_URL+"/images/comment.png"} alt="" width={"20px"} />
                            <b>  Comment</b>
                        </button>
                        <small className="likeNcommentcount">  {approximate(props.comments)}</small>    
                    </div>  
                </div>
                
                {displayComment && <CommentSection reviewId={props.id} bookId={props.bookId} />}
                
                <div className="line--dec review--viewcomment" hidden={displayComment}>
                    <hr className="login--hr"/>
                    <small 
                        hidden={!props.comments}
                        className="login--newto gray comment--link"
                        onClick={()=>setDisplayComment(true)}
                    > view comments </small>    
                </div>
                
            </div>
        </div>
    )
}

export default Review;