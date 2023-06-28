import React from "react";
import { useSearchParams } from "react-router-dom";

export default function Paginate(props) {
    const [startPageNo,setStartPageNo] = React.useState(1)
    const lastPageNo = Math.ceil(props.totalItems/props.itemsPerPage)
    const displayAtOnce=5
    const [searchParam,setSearchParam] = useSearchParams()
    const containerRef = React.useRef(null)

    const handleSearchParam = pageno => {
        props.scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setSearchParam(prevParam => {
            prevParam.set('pageno',pageno)
            return prevParam
        })
    }

    const handleSearchParamByOneUnit = direction => {
        props.scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setSearchParam(prevParam => {
            const previousPage = parseInt(prevParam.get("pageno")) - 1
            const nextPage = parseInt(prevParam.get("pageno")||1) + 1
            prevParam.set('pageno', direction==="prev"? previousPage : nextPage )
          
            if (direction==="next" && nextPage>(startPageNo+displayAtOnce-1))
                setStartPageNo(prev => prev+1)
            else if (direction==="prev" && previousPage<(startPageNo))
                setStartPageNo(prev => prev-1 )
            return prevParam
        })
    }

    const firstItemIndex = searchParam.get("pageno") ? 
        (parseInt( searchParam.get("pageno") ) -1 ) * props.itemsPerPage + 1 : 1
    const lastItemIndex = (firstItemIndex+props.itemsPerPage-1)<=props.totalItems ?
        firstItemIndex+props.itemsPerPage-1 : props.totalItems
    let pageNo=[]

    for (let i = startPageNo ; i <=  ((startPageNo+displayAtOnce-1)<lastPageNo ?startPageNo+displayAtOnce-1 : lastPageNo); i++) {
        pageNo.push(
            <button 
                className="paginate--pageno" 
                key={i}
                onClick={()=>handleSearchParam(i)}
                style={{background: parseInt(searchParam.get("pageno"))===i? "rgb(57, 125, 233)":""}}
            >
                {i}
            </button>
        )
    }

    return(
        <div ref={containerRef} className="paginate--container">
            <pre>Displaying {firstItemIndex} - {lastItemIndex} out of {props.totalItems}</pre>

            <div className="paginate--pageno--container">
                {startPageNo!==1 &&
                    <button className="nobutton paginate--more" onClick={()=>handleSearchParamByOneUnit("prev")}>&lt;&lt; prev</button>
                }
                {pageNo}
                {startPageNo+displayAtOnce-1<lastPageNo &&
                    <button className="nobutton paginate--more" onClick={()=>handleSearchParamByOneUnit("next")}>next &gt;&gt;</button>
                }
            </div>
        </div>
    )
}