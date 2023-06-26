import React from "react";

export default function StarBlink() {
    const starArray = []
    const [starBlink,setStarBlink] = React.useState(-1)
    for (let i = 0; i < 5; i++) {
        let image = (i<=starBlink) ? "/images/star.jpeg":"/images/emptystar.png"
        starArray.push(<img 
            className="starblink--star" 
            key={i} 
            alt="star"
            src={process.env.PUBLIC_URL+image}
            onMouseOver={()=>setStarBlink(i)} 
        />)    
    }
    return(
        <div className="starblink--container">
            <div onMouseLeave={()=>setStarBlink(-1)}>
                {starArray}
            </div>
            <big>Rate this book </big>
        </div>     
    )
}