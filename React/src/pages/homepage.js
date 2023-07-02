import React from "react";
import Trending from "../components/trending";
import Slider from "../components/slider";
import HomeSearch from "../components/homesearch";

export default function Homepage () {
    const newRelease = [
        {id:1,name:"The Name of the Wind",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1270352123i/186074.jpg",rating:5,author:"Patrick Rothfuss"},
        {id:2,name:"The Way of Kings",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1659905828i/7235533.jpg",rating:5,author:"Brandon Sanderson"},
        {id:3,name:"The Eye of the World",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1659905815i/228665.jpg",rating:5,author:"Robert Jordan"},
        {id:4,name:"A Game of Thrones",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1562726234i/13496.jpg",rating:5,author:"George R R Martin"},
        {id:5,name:"The Art of The Fellowship of the Ring",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1347803870i/119.jpg",rating:5,author:"Gary Russell"},
        {id:6,name:"The Lord of the Rings: The Making of the Movie Trilogy",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1389501592i/7351.jpg",rating:5,author:"Brian Sibley"},
        {id:7,name:"The Lord of the Rings: Weapons and Warfare",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388290346i/36.jpg",rating:5,author:"christopher lee"}
    ] 
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
                    <Slider data={newRelease} />
                </div>
            </div>
            <br /><br /><br />
            <div className="homepage--heading">
                <h1>Upcoming Releases</h1>
                <hr className="home--hr"/>
                <div style={{position: 'relative'}} >
                    <Slider data={newRelease} />
                </div>
            </div>
            <br /><br /><br /><br />
            <HomeSearch />
        </>
    )
}