import React from "react";


export default function RatingRatio({rating}) {
    const starArray=[]
    const roundedOffRating = Math.round(rating*2)/2
    for (let i = 1; i <= 5; i++) {
        if (i<=roundedOffRating) {
            starArray.push(<img 
                className="ratingratio--star" 
                key={i} 
                src={process.env.PUBLIC_URL+"/images/star.png"}
                alt=''
            />)  
        }
        else if (i-roundedOffRating===0.5) {
            starArray.push(<img 
                className="ratingratio--star" 
                key={i} 
                src={process.env.PUBLIC_URL+"/images/halfstar.png"}
                alt=''
            />) 
        }
        else {
            starArray.push(<img 
                className="ratingratio--star" 
                key={i} 
                src={process.env.PUBLIC_URL+"/images/emptystar.png"}
                alt=''
            />)
        }
              
    }

    return(
        <div className="ratingratio" >
            {starArray}
            <b>{rating}</b>
        </div>
    )
}