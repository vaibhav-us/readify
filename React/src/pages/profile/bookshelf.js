import React from "react";
import SearchTile from "../../components/searchtile";
import { Filter, SearchBar, Sort } from "../../components/searchcomponents";
import SuchEmpty from "../../components/suchempty";
import { postItems, redirectIfNotLogged } from "../../utility";
import { useLoaderData } from "react-router-dom";

export async function loader (){
    await redirectIfNotLogged(`/profile/bookshelf`)

    const res = await postItems(
        {userid:localStorage.getItem("id")},`http://127.0.0.1:8000/searchbooks/`
    )
    return {bookshelfBooks:res.data}
}
export default function Bookshelf() {
    const [search,setSearch] = React.useState('')
    const [sortInfo,setSortInfo] = React.useState({sortValue:"",direction:""})
    const [filter,setFilter] = React.useState({1:true,2:true,3:true,4:true,5:true,Before:"3000-01-01",After:"0001-01-01"})
    // const bookshelfBooks = [
    //     {id:1,name:"The Name of the Wind",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1270352123i/186074.jpg",rating:5,author:"Patrick Rothfuss",publication:"2022-10-09"},
    //     {id:2,name:"The Way of Kings",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1659905828i/7235533.jpg",rating:4,author:"Brandon Sanderson",publication:"2022-03-03"},
    //     {id:3,name:"The Eye of the World",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1659905815i/228665.jpg",rating:5,author:"Robert Jordan",publication:"2021-10-09"},
    //     {id:4,name:"A Game of Thrones",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1562726234i/13496.jpg",rating:3,author:"George R R Martin",publication:"2020-08-10"},
    //     {id:5,name:"The Art of The Fellowship of the Ring",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1347803870i/119.jpg",rating:1,author:"Gary Russell",publication:"2019-03-12"},
    //     {id:6,name:"The Lord of the Rings: The Making of the Movie Trilogy",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1389501592i/7351.jpg",rating:2,author:"Brian Sibley",publication:"2003-10-09"},
    //     {id:7,name:"The Lord of the Rings: Weapons and Warfare",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388290346i/36.jpg",rating:4,author:"christopher lee",publication:"2023-10-01"}
    // ]
    const {bookshelfBooks} = useLoaderData()

    function handleFilterChange(e,field,checkbox=0) {
        setFilter(prev =>{
            return(
                {...prev , [field] : checkbox ? e.target.checked : e.target.value}
            )
        })
    }
    let filteredSearch = bookshelfBooks.filter(ele => 
        search.trim()==='' 
            ? 1 
            : ele.name.toLowerCase().includes(search.replace(/\s+/g, ' ').toLowerCase())
    )

    filteredSearch = filteredSearch.filter(ele => 
        (filter[ele.rating] || ele.rating===0) &&
        new Date(ele.publication) >= new Date(filter.After) &&
        new Date(ele.publication) <= new Date(filter.Before)
    )

    if (sortInfo.sortValue === "Rating") {
        filteredSearch.sort((a,b) => 
            sortInfo.direction==="asc"
                ? (a.rating - b.rating) 
                : (b.rating-a.rating)
        )
    }else if (sortInfo.sortValue === "Release Date"){
        filteredSearch.sort((a,b) => 
            sortInfo.direction==="asc"
                ? (new Date(a.publication) - new Date(b.publication)) 
                : (new Date(b.publication) - new Date(a.publication))
        )
    }else if (sortInfo.sortValue === "Alphabetical"){
        filteredSearch.sort((a,b) => 
            sortInfo.direction==="asc"
                ? (a.name.localeCompare(b.name)) 
                : (b.name.localeCompare(a.name)) 
        )
    }
    return(
        <div>
            <nav className="bookshelf--nav">
                <div className="bookshelf--topnav">
                    <SearchBar 
                        className="bookshelf--searchbar"
                        placeholder="Search Books"
                        onChange={(e)=>setSearch(e.target.value)}
                        onSubmit={(e) => e.preventDefault()}
                    />   
                    <Filter stateVar={filter} onChange={handleFilterChange} className="bookshelf--filter" /> 
                </div>
                
                <Sort onClick={(sortValue,direction) => setSortInfo({sortValue,direction}) } stateVar={sortInfo}/>    
            </nav>
            
            {filteredSearch && filteredSearch.length!==0 
            ?   filteredSearch.map(ele=> <SearchTile key={ele.id} logged={true} {...ele}/>)
            :   <SuchEmpty/> }
        </div>
    )
}