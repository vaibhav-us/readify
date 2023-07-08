import React from "react";
import { useLoaderData} from "react-router-dom";
import Paginate from "../components/paginate";
import SearchTile from "../components/searchtile";
import SuchEmpty from "../components/suchempty";

export function loader({request}) {
    const url = new URL(request.url)
    const book= url.searchParams.get('book')
    const genre= url.searchParams.get('genre')
    return book? book : genre
}

export default function SearchPage() {
    const key = useLoaderData()
    const containerRef = React.useRef(null)
    const data = [
        {id:1,name:"The Name of the Wind",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1270352123i/186074.jpg",rating:5,author:"Patrick Rothfuss",publication:"2022/10/09"},
        {id:2,name:"The Way of Kings",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1659905828i/7235533.jpg",rating:5,author:"Brandon Sanderson",publication:"2022/10/09"},
        {id:3,name:"The Eye of the World",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1659905815i/228665.jpg",rating:5,author:"Robert Jordan",publication:"2022/10/09"},
        {id:4,name:"A Game of Thrones",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1562726234i/13496.jpg",rating:5,author:"George R R Martin",publication:"2022/10/09"},
        {id:5,name:"The Art of The Fellowship of the Ring",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1347803870i/119.jpg",rating:5,author:"Gary Russell",publication:"2022/10/09"},
        {id:6,name:"The Lord of the Rings: The Making of the Movie Trilogy",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1389501592i/7351.jpg",rating:5,author:"Brian Sibley",publication:"2022/10/09"},
        {id:7,name:"The Lord of the Rings: Weapons and Warfare",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388290346i/36.jpg",rating:5,author:"christopher lee",publication:"2022/10/09"}
    ]
    const totalItems = 7
    const msgForSuchEmpty = { __html: `Couldn't find the book you are looking for? Contribute to us`}
    
    const searchResults = data.map(ele => <SearchTile key={ele.id} {...ele}/>)
    return(
        <div ref={containerRef} className="searchpage--container">
            <div className="searchpage--results">
                <h1>Showing Results For "{key}"</h1>
                {data && data.length!==0 ?
                    <>
                    {searchResults}
                    <Paginate scrollRef={containerRef} totalItems={totalItems} itemsPerPage={2}/>
                    </>
                    :
                    <SuchEmpty msg={msgForSuchEmpty}/>
                }
               
            </div>
            
            <div className="searchpage--filter">
                <h4>filter</h4>
            </div>
        </div>
    )
}