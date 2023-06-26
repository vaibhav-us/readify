import React from "react";
import Trending from "../components/trending";
import Slider from "../components/slider";
import HomeSearch from "../components/HomeSearch";

export default function Homepage () {
    const data = [{id:1,name:"Book 1"},{id:2,name:"Book 2"},{id:3,name:"Book 3"},{id:4,name:"Book 4"},{id:5,name:"Book 5"},{id:6,name:"Book 6"},{id:7,name:"Book 7"},{id:8,name:"Book 8"}]
    const newRelease = [
        {id:1,name:"The Name of the Wind",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1270352123i/186074.jpg",rating:5,author:"Patrick Rothfuss"},
        {id:2,name:"The Way of Kings",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1659905828i/7235533.jpg",rating:5,author:"Brandon Sanderson"},
        {id:3,name:"The Eye of the World",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1659905815i/228665.jpg",rating:5,author:"Robert Jordan"},
        {id:4,name:"A Game of Thrones",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1562726234i/13496.jpg",rating:5,author:"George R R Martin"},
        {id:5,name:"The Art of The Fellowship of the Ring",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1347803870i/119.jpg",rating:5,author:"Gary Russell"},
        {id:6,name:"The Lord of the Rings: The Making of the Movie Trilogy",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1389501592i/7351.jpg",rating:5,author:"Brian Sibley"},
        {id:7,name:"The Lord of the Rings: Weapons and Warfare",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388290346i/36.jpg",rating:5,author:"christopher lee"}
    ] 
    console.log(process.env.PUBLIC_URL);
    return(
        <>
            <Trending data = {data}/> 
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