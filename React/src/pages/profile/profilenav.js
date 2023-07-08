import React from "react";
import {  NavLink, Outlet } from "react-router-dom";

export default function ProfileNav() {
    return(
        <div className="profile--container">
            <nav className="profile--navbar">
                <NavLink 
                    to={"."}
                    className={({isActive}) => "profile--navlink" + (isActive ?" profile--navlink--active":"")}
                    end
                > Dashboard </NavLink>

                <NavLink
                    to="bookshelf"
                    className={({isActive}) => "profile--navlink" + (isActive ?" profile--navlink--active":"")}
                > Bookshelf </NavLink>

                <NavLink
                    to="recent"
                    className={({isActive}) => "profile--navlink" + (isActive ?" profile--navlink--active":"")}
                > Activities </NavLink>

                <NavLink
                    to='preference'
                    className={({isActive}) => "profile--navlink" + (isActive ?" profile--navlink--active":"")}
                > Preferences </NavLink>

                <NavLink 
                    to="recommendations"
                    className={({isActive}) => "profile--navlink" + (isActive ?" profile--navlink--active":"")}
                > Recommendations </NavLink>
            </nav>
            
            <main style={{marginLeft:"15%",width:"70%"}}>
                <Outlet/>
            </main>
        </div>
    )
}