import React from "react";
import Booktile from "./booktile";
import { Loading } from "./sadpath";
import { postItems } from "../utility";
import { useLocation } from "react-router-dom";

export default function Slider (props) {
    const containerRef = React.useRef(null)
    const location = useLocation()
    const [data,setData] = React.useState({books:[],pageno:1,totalbooks:0})
    const [scroll,setScroll] = React.useState()
    const [loading,setLoading] = React.useState(false)

    React.useEffect(()=>{
        async function call() {
            const newdata=await postItems({...props.postObject,pageno:data.pageno},props.api)
            setLoading(true)
            setData(prev => { return( {
                books:prev.books.concat(newdata.data) ,
                pageno:prev.pageno+1,
                totalbooks:newdata.totalbooks
            })})
            setLoading(false)
        }
        if (
            containerRef.current.scrollLeft >= containerRef.current.clientWidth*2*(data.pageno-1) &&
            data.pageno-1 <= data.totalbooks/10     
        ) 
            call()
    },[location.pathname,scroll])
    // React.useEffect(()=>{
    //     setData({books:[],pageno:1,totalbooks:0})
    //     containerRef.current.scrollLeft=0
    // },[location.pathname])

    const booktiles =data.books && data.books.map(obj => <Booktile key={obj.id} logged={props.logged} {...obj} />)

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