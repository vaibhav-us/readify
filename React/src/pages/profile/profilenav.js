import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function ProfileNav() {
    return(
        <div className="profile--container">
            <nav className="profile--navbar">
                <NavLink 
                    to={"."}
                    className={({isActive}) => "profile--navlink" + (isActive ?" profile--navlink--active":"")}
                    end
                > Profile </NavLink>
                <NavLink
                    to="recent"
                    className={({isActive}) => "profile--navlink" + (isActive ?" profile--navlink--active":"")}
                > Recent Activities </NavLink>
                <NavLink
                    to='preference'
                    className={({isActive}) => "profile--navlink" + (isActive ?" profile--navlink--active":"")}
                > Preferences </NavLink>
                <NavLink 
                    to="recommendations"
                    className={({isActive}) => "profile--navlink" + (isActive ?" profile--navlink--active":"")}
                > Recommendations </NavLink>
            </nav>
            <main >
                <Outlet/>
            </main>
        </div>
    )
}