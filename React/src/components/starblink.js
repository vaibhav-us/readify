import React from "react";

export default function StarBlink() {
    const starArray = []
    const [starBlink,setStarBlink] = React.useState(-1)
    const [status,setStatus] = React.useState("initial")
    const [userRating,setUserRating]=React.useState(0)

    const handleSubmit = e =>{
        e.preventDefault()
        if (e.nativeEvent.submitter.id==="clear") {
            setStarBlink(0)
            setStatus("saving")
            // give a post request here. Give hard coded data here as 0
            console.log(starBlink,"0 is submitted");
            setStatus("initial")
            return
        }
        setStatus("saving")
        //give a post request here 
        console.log(starBlink,"submitted");
        setStatus("saved")
        setUserRating(starBlink)
    }

    const handleMouseLeave = () => {
        if (status==="initial") setStarBlink(0) 
        else setStarBlink(userRating)
    }

    for (let i = 1; i <= 5; i++) {
        let image = (i<=starBlink) ? "/images/star.png":"/images/emptystar.png"
        starArray.push(<button key={i} id={i} className="nobutton starblink--button"><img 
            className="starblink--star" 
            alt="star"
            src={process.env.PUBLIC_URL+image}
            onMouseOver={()=>setStarBlink(i)}
            onMouseLeave={handleMouseLeave}
        /></button>)    
    }

    return(
        <form 
            onSubmit={handleSubmit} 
            className="starblink--container"   
            onMouseEnter={()=>{ if (status==="saved") setStatus("hovering") }}
            onMouseLeave={()=>{ if (status==="hovering") setStatus("saved")    }}
        >
            {status==="saving" ?
                <p className="gray">Saving....</p>
                :
                <div className="starblink--star--container">
                    {starArray}
                </div>
            }
            
            {status==="saved" || status==="hovering" ?
                status==="hovering"?
                    <button id="clear" type="submit" className="gray nobutton" ><big>Clear Rating</big></button> 
                    :
                    <big className="starblink--tick--container">
                        Rated
                        <img src={process.env.PUBLIC_URL+"/images/greentick.png"} alt=""/>
                    </big>                
                :
                <big>Rate this book</big>
            }
        </form>    
    )
}