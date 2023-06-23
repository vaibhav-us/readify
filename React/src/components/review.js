import React from "react";
import CollapseContainer from "./collapsecontainer";
import { Form } from "react-router-dom";

export default function Review(props) {
    const[year,month,day] = props.date.split("/")
    const date = new Date(year,month-1,day)
    const options = {year:"numeric",month:"long",day:"numeric"}
    const expandedDate = date.toLocaleDateString('en-US',options)

    const [like,setLike] = React.useState(false)
    const [showMore,setShowMore] = React.useState(false)
    function toggleShowMore() {
        setShowMore(!showMore)
    }
    const displayPoints = props.points.slice(0,3).map(point => <b className="review--point">{point}</b>)
    displayPoints.push(
        props.points[3] ? 
            showMore ?
            props.points.slice(3).map(point => <b className="review--point">{point}</b>) 
            :
            <b className="review--point--more" onClick={toggleShowMore}>...more</b>
        :
            null
    )

    const toggleLike = () => setLike(!like)
    const likeImage = like? 'images/liked.webp' : "images/like.png"

    return(
        <div className="review--container">
            <div>
                <big><h3>{props.name}</h3></big>
                <p>{expandedDate}</p>
            </div>

            <div>
                <div className="review--starrate">
                    <p>{props.rating}</p>
                    <img 
                        src={process.env.PUBLIC_URL+"images/star.jpeg"}
                        alt="brh"
                        width={"25px"}
                    />
                </div>

                <CollapseContainer data={props.review}/>

                {displayPoints}
                {displayPoints[0] && <><br/><br/></>}

                <span className="gray">{props.likes} likes & </span>
                <span className="gray">{props.comments} comments</span>
                <br/><br/>

                <Form className="review--likeNcomment">
                    <button className="nobutton" onClick={toggleLike}>
                        <img src={process.env.PUBLIC_URL+likeImage} alt="" width={"20px"} />
                        <b>  {like? "Liked":"Like"} </b>
                    </button>
                    <button className="nobutton">
                        <img src={process.env.PUBLIC_URL+"images/comment.png"} alt="" width={"20px"}  />
                        <b>  Comment</b>
                    </button>
                </Form>
                <br/><hr/>

            </div>
        </div>
    )
}