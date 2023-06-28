import React from "react";

export default function SuchEmpty(props) {
    return(
        <div className="suchempty--container gray">
            <h2>Wow such empty!</h2>
            <img src={process.env.PUBLIC_URL+"/images/smiley.png"} width={"100px"} alt=""/>
            <div dangerouslySetInnerHTML={props.msg}/>
        </div>
    )
}