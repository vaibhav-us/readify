import React from "react";
import Booktile from "./booktile";

export default function Slider (props) {
    const booktiles = props.data.map(obj => <Booktile key={obj.id} {...obj} />)
    const containerRef = React.useRef(null)

    function handleclick(direction) {
        containerRef.current.scrollLeft = direction==="left"?
            containerRef.current.scrollLeft-containerRef.current.clientWidth 
            : 
            containerRef.current.scrollLeft+containerRef.current.clientWidth
    }

    return(
        <div style={{overflow:"hidden"}}>
            <button className="slider--greater nobutton" onClick={()=>handleclick("right") } >&gt;</button>
            <button className="slider--lesser nobutton" onClick={()=>handleclick("left")} >&lt;</button>
            <div className="slider" ref={containerRef}>
                {booktiles}
            </div>
        </div>
    )
}