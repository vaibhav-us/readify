import React from "react";
import Booktile from "./booktile";

export default function Slider (props) {
    const booktiles = props.data.map(obj => <Booktile key={obj.id} {...obj} />)
    const containerRef = React.useRef(null)

    function handleclick(direction) {
        containerRef.current.scrollLeft = direction==="left"?
            containerRef.current.scrollLeft-400 : containerRef.current.scrollLeft+400
    }

    return(
        <div style={{overflow:"hidden",width:"97%"}}>
            <button className="slider--greater" onClick={()=>handleclick("right") } >&gt;</button>
            <button className="slider--lesser" onClick={()=>handleclick("left")} >&lt;</button>
            <div className="slider" ref={containerRef}>
                {booktiles}
            </div>
        </div>
    )
}