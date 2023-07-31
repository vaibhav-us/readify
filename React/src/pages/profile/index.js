import React from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import RatingRatio from "../../components/ratingratio";
import { fullDate, getItems, postItems, redirectIfNotLogged } from "../../utility";
import { CropImage } from "../../components/searchcomponents";

export async function loader() {
    await redirectIfNotLogged("/profile")
    const activities = await getItems(`http://127.0.0.1:8000/${localStorage.getItem("id")}/activity`)
    const bookshelfData = await postItems(
        {userid:localStorage.getItem("id")},`http://127.0.0.1:8000/searchbooks/`
    )
    return {activities:activities,bookshelfData:bookshelfData.data}
}
export default function PofileIndex() {
    const navigate = useNavigate()
    async function logout() {
        const res = await getItems(`http://127.0.0.1:8000/auth/logout/${localStorage.getItem("id")}/`)
        if (res.message && res.message==='logged out' ) {
            localStorage.clear()
            navigate("/",{replace:true})
        }
    }
    const user = localStorage.getItem("user")
    
    const {activities,bookshelfData} = useLoaderData()
    return(
        <div>
            <div className="personal--details">
                <div className="personal--stats">
                    <CropImage src="/images/defaultprofilepic.png" />
                    <Link className="noLink">0 ratings </Link>
                    <Link className="noLink">0 review</Link>
                </div>

                <div>
                    <b><big>Name</big></b>
                    <hr/>
                    <table className="vertical--table">
                    <tbody>
                        <tr>
                            <th>Details</th>
                            <td>data</td>
                        </tr>
                        <tr>
                            <th>Activity</th>
                            <td>data</td>
                        </tr>    
                    </tbody>
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
                                {/* <button className="gray nobutton">X</button> */}
                            </div>
                        </div>
                    )
                })}   
                </div>
            </div>

            <button 
                className="logout"
                onClick={logout}
            >  Log Out  </button>

        </div>
    )
}