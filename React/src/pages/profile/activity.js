import React from "react";
import { useLoaderData } from "react-router-dom";
import  { MediumSearchTile } from "../../components/searchtile";
import { fullDate, getItems, postItems, redirectIfNotLogged } from "../../utility";
import SuchEmpty from "../../components/suchempty";

export async function loader() {
    await redirectIfNotLogged('/profile/activity')
    const activities = await getItems(`http://127.0.0.1:8000/${localStorage.getItem("id")}/activity`)

    const promiseData= activities?.map( ele => {
        async function getPromiseValue() {
            const res = await postItems({userid:localStorage.getItem("id")},`http://127.0.0.1:8000/book/${ele.bookId}/`)
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
        activities && activities.length!==0 ?
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
                console.log(ele,details);
                const correspondingDetail = details.filter(element=>element.id===ele.bookId)
                console.log("cor",correspondingDetail);
                return(
                    <div key={ele.id} className="activitytile">
                        <div  className="activitytile--top">
                            <span>{user} has {ele.activity} </span>   
                            <div className="dashboard--activity--rhs">
                                <small className="gray">{fullDate(ele.date)}    </small>
                                {/* <button className="gray nobutton">X</button> */}
                            </div>
                        </div>
                        <MediumSearchTile  {...correspondingDetail[0]} logged={true}/>
                    </div>
                )
            })}

        </div>
        :
        <SuchEmpty msg="Your recent activities will appear here"/>
    )
}