import React from "react";

export default function Trending(props) {
    const containerRef = React.useRef(null)
    const [dotHighlight,setDotHighlight] = React.useState([{id:0,truth:0,scroll:0},{id:1,truth:1},{id:2,truth:0},{id:3,truth:0},{id:4,truth:0},{id:5,truth:0},{id:6,truth:0},{id:7,truth:0},{id:8,truth:0}])  

    function Dots(props) {
        return(
            <p 
                className="dots"
                style={props.truth ?{backgroundColor: "rgb(209, 149, 224)"} : {}}
                onClick={()=>props.handleclickdots(props.id)}
            ></p>
        )
    }
    
    function handleclick(direction) {
        if (direction==="left" && !dotHighlight[1].truth) {
    
            setDotHighlight(prev => prev.map(obj=> {
    //            containerRef.current.scrollLeft -= containerRef.current.clientWidth
    //             if (containerRef.current.clientWidth%containerRef.current.scrollLeft!==0) {
    //                 const remainder=containerRef.current.clientWidth%containerRef.current.scrollLeft
    //                 containerRef.current.scrollLeft -= remainder
    //             }
                if (!obj.id) {
                    obj.scroll = prev[0].scroll-containerRef.current.clientWidth
                    containerRef.current.scrollLeft=obj.scroll
                }
                if (obj.truth)
                    obj.truth=0
                if (obj.id === (prev[0].scroll/containerRef.current.clientWidth)+1){
                    obj.truth=1
                }
                return( {...obj})
            }))
        }
        else if (direction==="right" && !dotHighlight[8].truth) {
       
            setDotHighlight(prev => prev.map(obj=> {
    //             containerRef.current.scrollLeft = containerRef.current.scrollLeft+containerRef.current.clientWidth
    //             console.log(containerRef.current.scrollLeft,containerRef.current.clientWidth);
    //             if (containerRef.current.clientWidth%containerRef.current.scrollLeft!==0) {
    //                 const remainder=containerRef.current.clientWidth%containerRef.current.scrollLeft
    //                 containerRef.current.scrollLeft -= remainder
    //             }
                if (!obj.id) { 
                    obj.scroll = prev[0].scroll+containerRef.current.clientWidth
                    containerRef.current.scrollLeft=obj.scroll
                }
                if (obj.truth)
                    obj.truth=0
                if (obj.id === (prev[0].scroll/containerRef.current.clientWidth)+1){
                    obj.truth=1
                }
                return( {...obj})
            }))
        }
    }
    
    function handleclickdots(theId) {
        setDotHighlight(prev => prev.map(obj=> {
                
            if (!obj.id) {
                obj.scroll = (theId-1)* (containerRef.current.clientWidth)
                containerRef.current.scrollLeft=obj.scroll
            }
            if (obj.truth)
                obj.truth=0
            if (obj.id === theId){
                obj.truth=1
            }
            return( {...obj})
        }))
    }

    return(
        <div className="trending--section">
            <button className="leftbutton" onClick={()=>handleclick("left")}>&lt;</button>
            <button className="rightbutton" onClick={()=>handleclick("right")}>&gt;</button>

            <div className="trending--books"  ref={containerRef}>
            {props.data.map(obj => {

                //input the actual data
                
                return(    
                    <div key={obj.id} className="trending--book" style={{backgroundImage: 'url("https://cdn.mos.cms.futurecdn.net/c1b8bef92fb82ae5aba540b469b804ce-1200-80.jpg")'}}>
                        <h1>Lord of The Rings</h1>
                        <h2>J R R Tolkien</h2> 
                    </div>
                )
            })}
            </div>
             
            <div className="displaydots--container">
                {dotHighlight.map(({id,truth}) => id ? <Dots key={id} id={id} truth={truth} handleclickdots={handleclickdots}/> : null)}
            </div>
            
            
        </div>
    )
}