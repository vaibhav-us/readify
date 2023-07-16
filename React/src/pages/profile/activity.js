import React from "react";
import { useLoaderData } from "react-router-dom";
import  { MediumSearchTile } from "../../components/searchtile";
import { fullDate, getItems } from "../../utility";

export async function loader() {
    const activities = [
        {id:1,activity:"reviewed",bookId:1,book:"The Name of the Wind",date:"2022/05/03"},
        {id:2,activity:"rated",rating:3,bookId:2,book:"The Way of Kings",date:"2022/06/09"},
        {id:3,activity:"rated",rating:4,bookId:3,book:"A Game of Thrones",date:"2012/02/03"},
        {id:4,activity:"reviewed",bookId:4,book:"The Art of The Fellowship of the Ring",date:"2023/01/01"},
        {id:5,activity:"rated",rating:5,bookId:5,book:"Weapons and Warfare",date:"2001/01/01"},
        {id:6,activity:"reviewed",bookId:6,book:"The Making of the Movie Trilogy",date:"2002/05/30"}
    ]
    
    const promiseData= activities.map( ele => {
        async function getPromiseValue() {
            const res = await getItems(`http://127.0.0.1:8000/book/${ele.id}`)
            return res.data
        }
        return getPromiseValue()
    })
    const data = await Promise.all(promiseData)

    return {details:data,activities}
}

export default function Activity() {
    const {details,activities}=useLoaderData()
    const [sort,setSort] = React.useState('')
    const user = localStorage.getItem("user")

    const filtered = activities.filter(ele => sort!==''? ele.activity===sort.toLowerCase() : 1)

    return(
        <div>

            <div className="activity--sort--container">
                <span className="sort--tag">Sort By</span>
                
                {["Reviewed","Rated"].map(ele => 
                    <button 
                        className="sort--button activity--sortbutton"
                        onClick={()=>setSort(ele)}
                        style={sort===ele?{fontSize:"20px",backgroundColor: "rgb(177, 233, 233)"}:{}}
                    >  {ele}</button> 
                )}

                {sort!=='' && <button className="nobutton activity--sortbutton" onClick={()=>setSort('')}>Clear sort</button>}
            </div>
            

            {filtered.map(ele => {
                const correspondingDetail = details.filter(element=>element.id===ele.id)
                return(
                    <div key={ele.id} className="activitytile">
                        <div  className="activitytile--top">
                            <span>{user} has {ele.activity} </span>   
                            <div className="dashboard--activity--rhs">
                                <small className="gray">{fullDate(ele.date)}    </small>
                                <button className="gray nobutton">X</button>
                            </div>
                        </div>
                        <MediumSearchTile  {...correspondingDetail[0]}/>
                    </div>
                )
            })}

        </div>
    )
}