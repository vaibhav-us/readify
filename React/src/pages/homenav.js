import React from "react";
import { Outlet,Link, redirect, useLocation } from "react-router-dom";
import ScrollToTop from "../components/scrolltotop";
import { CropImage, SearchBar } from "../components/searchcomponents";
import { postItems } from "../utility";
import { MiniSearchTile } from "../components/searchtile";
import SuchEmpty from "../components/suchempty";

export async function action({request}) {
    const formData = await request.formData()
    return redirect(`/search?book=${formData.get("search")}`)
}

export default function Homenav () {
    const [search,setSearch] = React.useState('')
    const searchResultsRef = React.useRef()
    const [searchResults,setSearchResults] = React.useState({visible:false,data:[]})
    const location = useLocation()
    const msgForSuchEmpty = { __html: `Couldn't find the book you are looking for? <a href="/contribute">Contribute to us</a>`}

    React.useEffect(()=>{ async function call() {
        const res = await postItems({book:search},`http://127.0.0.1:8000/searchbooks/`)
        res.data.forEach(ele => delete ele.genre);

        setSearchResults(prev =>( 
            {visible:true , data:res.data} 
        ))
      }  
        call()   

        const handleSearchResultVisibility = (e) => {
            setSearchResults(prev=>
                searchResultsRef.current && !searchResultsRef.current.contains(e.target)
                ?    ({...prev,visible:false}) 
                :    prev
            )
        }
        document.addEventListener("click",handleSearchResultVisibility)
        
        return ()=> document.removeEventListener("click",handleSearchResultVisibility)
    },[search])

    const DisplaySearchResults = searchResults.data.map(ele => {return(
        <div>
            <MiniSearchTile key={ele.id} {...ele}/>

            {searchResults.data[searchResults.data.length-1]!==ele &&
            <><hr className="searchresults--hr"/><br/></>}
        </div>
    )})

    return(
        <div className="app">
            <div className="homenav--container">
                <Link to='/' className="homenav--logo">
                    <h4>BRR</h4>
                </Link>

                <div className="homenav--search--container">
                    <SearchBar 
                        name="search" 
                        placeholder="Search books" 
                        style={{width:"70%"}}
                        onChange={(e) => setSearch(e.target.value)}
                        onSubmit={(e) =>{ if (!search.trim()) e.preventDefault() }} //checking if search field is empty
                    />

                    {search.trim() && searchResults.visible && 
                    <div ref={searchResultsRef} className="searchresults--container">
                        {DisplaySearchResults}
                        
                        {searchResults.data.length===0 && 
                        <SuchEmpty style={{color:"white"}} msg={msgForSuchEmpty}/>}   
                         
                    </div>}

                </div>
                
                <Link to={localStorage.getItem("id")?"/profile":'/login'} className="homenav--login noLink">
                    {localStorage.getItem("id")
                        ?   <CropImage 
                                src='/images/defaultprofilepic.png'
                                className="homenav--profile" 
                            />
                        :   <h2>login</h2>
                    }
                </Link>
            </div>
            <ScrollToTop/>
            <Outlet />
        </div>
        
    )
}