import React from "react";
import CollapseContainer from "./collapsecontainer";
import { approximate, fullDate } from "../utility";
import RatingRatio from "./ratingratio";
import CommentSection from "./commentsection";

const Review = (props) => {
    const [like,setLike] = React.useState(false)
    const [showMore,setShowMore] = React.useState(false)
    const [displaySpoiler,setDisplaySpoiler]=React.useState(props.spoiler || false)
    const [displayComment,setDisplayComment]=React.useState(false)

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

    const toggleLike = () => setLike(!like)
    const likeImage = like? '/images/liked.png' : "/images/like.png"

    return(
        <div className="review--container">
            <div>
                <big><h3>{props.name}</h3></big>
                <p>{ fullDate(props.date) }</p>
            </div>

            <div>
                <div className="review--starrate">
                    <RatingRatio rating={props.rating} />
                </div>

                {displaySpoiler?
                    <SpoilerTag/>
                    :
                    <CollapseContainer data={props.review} height={100}/>
                }

                {displayTags[0] && 
                <>{displayTags}<br/><br/></>
                }

                <div className="review--likeNcomment">
                    <div>
                        <button type="submit" className="nobutton" onClick={toggleLike} name="like">
                            <img  src={process.env.PUBLIC_URL+likeImage} alt="" width={"20px"} />
                            <b>  {like? "Liked":"Like"} </b>
                        </button>
                        <small> {approximate(props.likes) }</small>    
                    </div>

                    <div>
                        <button className="nobutton" onClick={()=>setDisplayComment(true)}>
                            <img src={process.env.PUBLIC_URL+"/images/comment.png"} alt="" width={"20px"} />
                            <b>  Comment</b>
                        </button>
                        <small>  {approximate(props.comments)}</small>    
                    </div>  
                </div>
                
                {displayComment && <CommentSection id={props.id} />}
                <br/><hr/>
            </div>
        </div>
    )
}

export default Review;