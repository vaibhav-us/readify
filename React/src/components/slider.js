import React from "react";
import Booktile from "./booktile";
import { Loading } from "./sadpath";
import { postItems } from "../utility";

export default function Slider (props) {
    const containerRef = React.useRef(null)
    const [data,setData] = React.useState({books:[],pageno:1})
    const [scroll,setScroll] = React.useState()
    const [loading,setLoading] = React.useState(false)

    React.useEffect(()=>{
        async function call() {
            const newdata=await postItems({...props.postObject,pageno:data.pageno},props.api)
            setLoading(true)
            setData(prev => { return(
                {books:prev.books.concat(newdata.data) ,pageno:prev.pageno+1}
            )})
            setLoading(false)
        }
        if (containerRef.current.scrollLeft >= containerRef.current.clientWidth*2*(data.pageno-1)) 
            call()
    },[scroll,props.postObject])
    const booktiles =data.books && data.books.map(obj => <Booktile key={obj.id} {...obj} />)

    function handleclick(direction) {
        containerRef.current.scrollLeft = direction==="left"
        ?   containerRef.current.scrollLeft-containerRef.current.clientWidth 
        :   containerRef.current.scrollLeft+containerRef.current.clientWidth
        
        setScroll( containerRef.current.scrollLeft)
    }
    
    return(
         <div style={{overflow:"hidden"}}>
            <button className="slider--greater nobutton" onClick={()=>handleclick("right") } >&gt;</button>
            <button className="slider--lesser nobutton" onClick={()=>handleclick("left")} >&lt;</button>
            <div className="slider" ref={containerRef}>
                {booktiles}
                {loading && <Loading/>}
            </div>
        </div>
    )
}