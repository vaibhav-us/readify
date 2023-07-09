import React from "react";
import { Link } from "react-router-dom";
import { postItems } from "../utility";

export function StarBlink({bookId,className,style}) {
    const starArray = []
    const [starBlink,setStarBlink] = React.useState(-1)
    const [status,setStatus] = React.useState("initial")
    const [userRating,setUserRating]=React.useState(0)

    async function handleSubmit(e) {
        e.preventDefault()
        setStatus("saving")
        console.log({rating:starBlink},"submitted"); 
        
        const res = await postItems({rating:starBlink},`http://127.0.0.1:8000/1/book/${bookId}/addreview/`)

        setStatus(e.nativeEvent.submitter.id==="clear"?"initial":"saved")
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
            style={style ? style:{} }
            className={"starblink--container"+(className?` ${className}`:"")}
            onMouseEnter={()=>{ if (status==="saved") setStatus("hovering") }}
            onMouseLeave={()=>{ if (status==="hovering") setStatus("saved")    }}
        >
            {status==="saving" 
            ?   <p className="gray">Saving....</p>
            :   <div className="starblink--star--container">
                    {starArray}
                </div>
            }
            
            {status==="saved" || status==="hovering" 
            ?   status==="hovering"
                ?   <button id="clear" type="submit" className="gray nobutton" ><span onClick={()=>setStarBlink(6)}>Clear Rating</span></button>    
                :   <big className="starblink--tick--container">
                        Rated
                        <img src={process.env.PUBLIC_URL+"/images/greentick.png"} alt=""/>
                    </big>                
            :   <big>Rate this book</big>
            }
        </form>    
    )
}

export function ReviewButton({bookId,className,style}) { 

    return(
        <Link 
            to={`/book/${bookId}/review`} 
            style={style ? style:{} }
            className={"rnr--links--review"+(className?` ${className}`:"")}
        >  Write a review  </Link>
    )
}

export function WantToRead({bookId,className,style}) {
    return(
        <button 
            className={"wanttoread"+(className?` ${className}`:"")}
            style={style ? style:{} }
        >   Want to read  </button>
    )
}

