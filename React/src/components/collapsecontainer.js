import React from "react";

export default function CollapseContainer(props) {
    const containerRef = React.useRef(null);
    const [showFullContent, setShowFullContent] = React.useState(false);
    const [containerHeight, setContainerHeight] = React.useState(0);

    React.useEffect(() => {
        const handleWindowResize = () => {
            setContainerHeight(containerRef.current?.clientHeight)
        }
        setContainerHeight(containerRef.current?.clientHeight)
        window.addEventListener("resize",handleWindowResize)       //updates containerHeight when window is resized

        return () => window.removeEventListener("resize",handleWindowResize)
    },[])

    const toggleContent = () => {
        setShowFullContent(!showFullContent);
    };

    return (
        <div className="bookdesc--container">
            <div
                ref={containerRef} 
                style={{ maxHeight: showFullContent ? 'none' : (props.height ), overflow: 'hidden' }}
            >
                {props.data}
            </div>
        

            {(containerHeight>=props.height  ) && (

            <div className="showmore" onClick={toggleContent} >
                {showFullContent ? 'show less' : 'show more'}
            </div>

            )}
        </div>
    );
};
