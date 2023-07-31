import React from "react";
import Trending from "../components/trending";
import Slider from "../components/slider";
import HomeSearch from "../components/homesearch";
import { isLogged } from "../utility";
import { useLoaderData } from "react-router-dom";
// import { useLoaderData } from "react-router-dom";
// import { postItems } from "../utility";

export async function loader() {
    const logged = await isLogged()

    // const  data = await postItems({pageno:1},"http://127.0.0.1:8000/allbooks/")
    // return data.data;
    return {logged}
}

export default function Homepage () { 
    const {logged} = useLoaderData()
    const trendingData =[
        {id:11,name:"Lord Of The Rings: The Return Of The King",author:"J R R Tolkien",landscapeImage:"https://images2.alphacoders.com/122/1229385.png"},
        {id:12,name:"Harry Potter And The Deadly Hallows",author:"J K Rowling",landscapeImage:"https://i.pinimg.com/originals/28/08/48/28084856145bd08d247a640f6eed8906.jpg"},
        {id:13,name:"Lord Of The Rings: The Fellowship Of The Ring",author:"J R R Tolkien",landscapeImage:"https://cdn.wallpapersafari.com/66/75/oMcK3X.jpg"},
        {id:14,name:"Percy Jackson And The Lightning Thief",author:"Rick Riordan",landscapeImage:"https://wallpapercave.com/wp/wp2961879.jpg"},
        {id:15,name:"Harry Potter And The Goblet Of Fire",author:"J K Rowling",landscapeImage:"https://wallpaperaccess.com/full/3781681.jpg"},
        {id:16,name:"A Game Of Thrones",author:"George R R Martin",landscapeImage:"https://cdn.wallpapersafari.com/79/77/vNsjOn.jpg"},
        {id:17,name:"The Name Of The Wind",author:"Patrick Rothfuss",landscapeImage:"https://i.redd.it/khxf80slotf51.png"},        
        {id:18,name:"Wise Man's Fear",author:"Patrick Rothfuss",landscapeImage:"https://i.pinimg.com/originals/f4/e1/16/f4e1162071d1bcbf3bb998d965849b6a.jpg"} 
    ]

    return(
        <>
            <Trending data = {trendingData}/> 
            <br />
            <div className="homepage--heading">
                <h1>New Releases</h1>
                <hr className="home--hr"/>
                <div style={{position: 'relative'}} >
                    <Slider logged={logged} api="http://127.0.0.1:8000/searchbooks/" />
                </div>
            </div>
            <br /><br /><br />
            <div className="homepage--heading">
                <h1>Upcoming Releases</h1>
                <hr className="home--hr"/>
                <div style={{position: 'relative'}} >
                    <Slider logged={logged} api="http://127.0.0.1:8000/searchbooks/" />
                </div>
            </div>
            <br /><br /><br /><br />
            <HomeSearch />
        </>
    )
}