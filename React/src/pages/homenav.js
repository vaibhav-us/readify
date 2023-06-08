import React from "react";
import { Outlet,Link } from "react-router-dom";

export default function Homenav () {
    return(
        <div className="app">
            <div className="homenav--container">
                <Link to='/' className="homenav--logo">
                    <h4>BRR</h4>
                </Link>
            </div>
            <Outlet />
        </div>
        
    )
}