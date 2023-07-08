import React from "react";
import { Outlet,Link, redirect } from "react-router-dom";
import ScrollToTop from "../components/scrolltotop";
import { CropImage, SearchBar } from "../components/searchcomponents";

export async function action({request}) {
    const formData = await request.formData()
    return redirect(`/search?book=${formData.get("search")}`)
}

export default function Homenav () {
    const [search,setSearch] = React.useState('')
    return(
        <div className="app">
            <div className="homenav--container">
                <Link to='/' className="homenav--logo">
                    <h4>BRR</h4>
                </Link>

                <SearchBar 
                    name="search" 
                    placeholder="Search books" 
                    style={{width:"70%"}}
                    onChange={(e) => setSearch(e.target.value)}
                    onSubmit={(e) =>{ if (!search.trim()) e.preventDefault() }} //checking if search field is empty
                />

                <Link to={localStorage.getItem("user")?"/profile":'/login'} className="homenav--login noLink">
                    {localStorage.getItem("user")
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