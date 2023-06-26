import React from "react";
import { Outlet,Link } from "react-router-dom";

export default function Homenav () {
    const [searchWord,setSearchWord] = React.useState('')

    return(
        <div className="app">
            <div className="homenav--container">
                <Link to='/' className="homenav--logo">
                    <h4>BRR</h4>
                </Link>

                <div className="searchbar">
                    <input 
                        placeholder="Search Books" 
                        onChange={(e)=>setSearchWord(e.target.value)}
                        value={searchWord}
                    />
                    <Link to={"/search?book="+searchWord} >
                        <img src={process.env.PUBLIC_URL+"/images/search.png"} alt="" width={"20px"}/>
                    </Link>
                </div>

                <Link to='/login' className="homenav--login noLink">
                    <h2>login</h2>
                </Link>
            </div>
            <Outlet />
        </div>
        
    )
}