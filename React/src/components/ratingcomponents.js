import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getItems, isLogged, postItems } from "../utility";

export function StarBlink({bookId,className,style,logged}) {
    const starArray = []
    const [starBlink,setStarBlink] = React.useState(-1)
    const [status,setStatus] = React.useState("initial")
    const [userRating,setUserRating]=React.useState( 0)
    const navigate = useNavigate()
    const location = useLocation()

    React.useEffect( () => {
        async function call() {
            const  review =await postItems(
                {pageno:1,userid:localStorage.getItem('id'),getOneReview:1},
                `http://127.0.0.1:8000/book/${bookId}/review`
            )
            if (logged && review.data[0] && review.data[0].rating) {    
                setUserRating(review
                    .data[0].rating);
                setStarBlink(review.data[0].rating)
                // onRated(true)
                setStatus("saved")
            }
        }
        call()
    },[])

    async function handleSubmit(e) {
        e.preventDefault()

        if (! logged){
            navigate(`/auth?redirectTo=${location.pathname}&msg=You Must Be Logged In First`)
            return
        }
        
        setStatus("saving")
        console.log({rating:starBlink===0?6:starBlink},"submitted"); 
        
        const res = await postItems({rating:starBlink===0?6:starBlink},`http://127.0.0.1:8000/${localStorage.getItem("id")}/book/${bookId}/addreview/`)

        setStatus(e.nativeEvent.submitter.id==="clear"?"initial":"saved")
        // onRated(e.nativeEvent.submitter.id !=="clear")
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
                ?   <button id="clear" type="submit" className="gray nobutton" ><span onClick={()=>setStarBlink(0)}>Clear Rating</span></button>    
                :   <big className="starblink--tick--container">
                        Rated
                        <img src={process.env.PUBLIC_URL+"/images/greentick.png"} alt="" />
                    </big>                
            :   <big>Rate this book</big>
            }
        </form>    
    )
}

export function ReviewButton({bookId,className,style,logged}) {
    const [reviewed,setReviewed] = React.useState(false)
    React.useEffect( () => {
        async function call() {
            const  review =await postItems(
                {pageno:1,userid:localStorage.getItem('id'),getOneReview:1},
                `http://127.0.0.1:8000/book/${bookId}/review`
            )
            if (review.data[0] && review.data[0].review) {    
                setReviewed(true)
            }
        }
       if(logged) call()
    },[])

    return(
        <Link 
            to={`/book/${bookId}/review${reviewed ? '/'+localStorage.getItem("id"):''}`} 
            style={style ? style:{} }
            className={"rnr--links--review"+(className?` ${className}`:"")}
        >  {reviewed?"View your review":"Write a review"}  </Link>
    )
}

export function WantToRead({bookId,className,style,logged}) {
    const navigate = useNavigate()
    const location = useLocation()
    const [submitted,setSubmitted] = React.useState(false)
    const [hover,setHover] = React.useState(false)

    React.useEffect(()=>{
        async function call() {
            if (logged){
                const data = await postItems({userid:localStorage.getItem('id')},`http://127.0.0.1:8000/book/${bookId}/`)
                setSubmitted(data.data.isShelf);
            }
        }
        call()
    },[])
    async function handleSubmit(){
        if (!logged){
            navigate(`/auth?redirectTo=${location.pathname}&msg=You Must Be Logged In First`)
            return
        }

        const res = await getItems(`http://127.0.0.1:8000/${localStorage.getItem("id")}/${bookId}/${submitted? 'remshelf' : 'addshelf'}`)
        setSubmitted(!submitted)
    }

    const hoveringStyle = hover ? "wanttoread wtrsubmitted--hover" :"wanttoread wtrsubmitted"
    return(
        !submitted 
        ?   <button 
                onClick={handleSubmit}
                className={"wanttoread wtrnotsubmitted"+(className?` ${className}`:"")}
                style={style ? style:{} }
            >   Want to read  </button>

        :   <button 
                onClick={handleSubmit}
                className={hoveringStyle+(className?` ${className}`:"")}
                style={style ? style:{} }
                onMouseEnter={()=>setHover(true)}
                onMouseLeave={()=>setHover(false)}
            >     
                {!hover
                ?   <>
                    <img 
                        src={process.env.PUBLIC_URL+"/images/shelf.png"}
                        className="searchtile--img"    
                    />
                    Added to Shelf
                    </>
                :   "Remove"
                }
            </button>    
    )
}

