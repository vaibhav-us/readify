import React from "react";
import { Link } from "react-router-dom";
import RatingRatio from "../../components/ratingratio";
import { fullDate } from "../../utility";
import { CropImage } from "../../components/searchcomponents";

export default function PofileIndex() {
    const user = localStorage.getItem("user")
    const bookshelfData = [
        {id:1,name:"The Name of the Wind",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1270352123i/186074.jpg",rating:5,author:"Patrick Rothfuss"},
        {id:2,name:"The Way of Kings",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1659905828i/7235533.jpg",rating:5,author:"Brandon Sanderson"},
        {id:3,name:"The Eye of the World",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1659905815i/228665.jpg",rating:5,author:"Robert Jordan"},
        {id:4,name:"A Game of Thrones",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1562726234i/13496.jpg",rating:5,author:"George R R Martin"},
        {id:5,name:"The Art of The Fellowship of the Ring",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1347803870i/119.jpg",rating:5,author:"Gary Russell"},
        {id:6,name:"The Lord of the Rings: The Making of the Movie Trilogy",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1389501592i/7351.jpg",rating:5,author:"Brian Sibley"},
        {id:7,name:"The Lord of the Rings: Weapons and Warfare",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388290346i/36.jpg",rating:5,author:"christopher lee"}
    ]
    const activities = [
        {id:1,activity:"reviewed",bookId:1,book:"The Name of the Wind",date:"2022/05/03"},
        {id:2,activity:"rated",rating:3,bookId:2,book:"The Way of Kings",date:"2022/06/09"},
        {id:3,activity:"rated",rating:4,bookId:3,book:"A Game of Thrones",date:"2012/02/03"},
        {id:4,activity:"reviewed",bookId:4,book:"The Art of The Fellowship of the Ring",date:"2023/01/01"},
        {id:5,activity:"rated",rating:5,bookId:5,book:"Weapons and Warfare",date:"2001/01/01"},
        {id:6,activity:"reviewed",bookId:6,book:"The Making of the Movie Trilogy",date:"2002/05/30"}
    ]
    return(
        <div>
            <div className="personal--details">
                <div className="personal--stats">
                    <div className="profile--img">
                        <img  src={process.env.PUBLIC_URL+"/images/defaultprofilepic.png"} alt=""/>
                    </div>
                    {/* <CropImage src="/images/defaultprofilepic.png" /> */}
                    <Link className="noLink">0 ratings </Link>
                    <Link className="noLink">0 review</Link>
                </div>

                <div>
                    <b><big>Name</big></b>
                    <hr/>
                    <table className="vertical--table">
                        <tr>
                            <th>Details</th>
                            <td>data</td>
                        </tr>
                        <tr>
                            <th>Activity</th>
                            <td>data</td>
                        </tr>
                    </table>
                </div>
            </div>

            <div>
                <h3>Your Bookshelf</h3> <hr/>
                <div className="dashboard--bookshelf">
                    {bookshelfData.map(ele => <img 
                        key={ele.id}
                        src={ele.image}
                        alt=""
                        width={"100px"}
                    />)}
                </div>
            </div>

            <div>
                <h3>Rcecent Activities</h3> <hr/>
                <div className="dashboard--activity--container">
                {activities.map(ele=>{
                    return(
                        <div key={ele.id} className="dashboard--activity">
                            <span>{user} has {ele.activity}    <Link className="noLink dashboard--activity--bookname" to={`/book/${ele.bookId}`}>{ele.book}</Link>    </span>   
                            {ele.activity==="rated" && <RatingRatio rating={ele.rating}/>}
                            <div className="dashboard--activity--rhs">
                                <small className="gray">{fullDate(ele.date)}    </small>
                                <button className="gray nobutton">X</button>
                            </div>
                        </div>
                    )
                })}   
                </div>
            </div>
        </div>
    )
}