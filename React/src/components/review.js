import React from "react";
import CollapseContainer from "./collapsecontainer";
import { Form } from "react-router-dom";
import { fullDate } from "../utility";
import RatingRatio from "./ratingratio";

const Review = (props) => {
    const [like,setLike] = React.useState(false)
    const [showMore,setShowMore] = React.useState(false)
    const [displaySpoiler,setDisplaySpoiler]=React.useState(props.spoiler || false)
    function toggleShowMore() {
        setShowMore(!showMore)
    }
    const displayPoints = props.points.slice(0,3).map(point => <b key={point} className="review--point">{point}</b>)
    displayPoints.push(
        props.points[3] ? 
            showMore ?
            props.points.slice(3).map(point => <b key={point} className="review--point">{point}</b>) 
            :
            <b key='more' className="review--point--more" onClick={toggleShowMore}>...more</b>
        :
            null
    )

    const toggleLike = () => setLike(!like)
    const likeImage = like? '/images/liked.jpg' : "/images/like.png"

    const expandedDate = fullDate(props.date)
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

    return(
        <div className="review--container">
            <div>
                <big><h3>{props.name}</h3></big>
                <p>{expandedDate}</p>
            </div>

            <div>
                <div className="review--starrate">
                    <RatingRatio rating={props.rating} />
                </div>

                {displaySpoiler?
                    <SpoilerTag/>
                    :
                    <CollapseContainer data={props.review}/>
                }

                {displayPoints}
                {displayPoints[0] && <><br/><br/></>}

                <span className="gray">{props.likes} likes & </span>
                <span className="gray">{props.comments} comments</span>
                <br/><br/>

                <Form className="review--likeNcomment">
                    <button className="nobutton" onClick={toggleLike}>
                        <img  src={process.env.PUBLIC_URL+likeImage} alt="" width={"20px"} />
                        <b>  {like? "Liked":"Like"} </b>
                    </button>
                    <button className="nobutton">
                        <img src={process.env.PUBLIC_URL+"/images/comment.png"} alt="" width={"20px"} />
                        <b>  Comment</b>
                    </button>
                </Form>
                <br/><hr/>

            </div>
        </div>
    )
}

export default Review;