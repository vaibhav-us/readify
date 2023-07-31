import { redirect } from "react-router-dom"

export async function postItems(object,api) {
    const res = await fetch(api, 
        {method : "POST", body: JSON.stringify(object),
        headers:{"Content-Type": "application/json"}}
    )

    const data = await res.json()
    if (!res.ok) {
        throw {
            message : data.message,
            statusText : res.statusText,
            status : res.status
        }
    }
    
    return data
}

export async function getItems(api) {
    const res = await fetch(api)
 
    const data = await res.json()
    if (!res.ok) {
        throw {
            message : data.message,
            statusText : res.statusText,
            status : res.status
        }
    }
    return data
}
export async function isLogged(){
    const res =await getItems(`http://127.0.0.1:8000/auth/islogged/${localStorage.getItem("id") || 0}/`)
    console.log(res);
    return res.isLogged?true:false
}
export async function redirectIfNotLogged(pathname){
    if (!await isLogged()){
        throw redirect(`/auth?redirectTo=${pathname}&msg=You Must Be Logged In First`)   
    }
}

export function fullDate(date) {
    const[year,month,day] = date.split("-")
    const dateObject = new Date(year,month-1,day)
    const options = {year:"numeric",month:"long",day:"numeric"}
    return dateObject.toLocaleDateString('en-US',options)
}

export function getRelativeTime(dateString) {
    const date = new Date(dateString); 
    const now = new Date(); 
    
    var elapsed = now - date; 
    
    const minute = 60*1000 ;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
    const year = 365 * day;
  
    if (elapsed < minute) 
      return Math.round(elapsed/1000) + ' seconds ago';

    else if (elapsed < hour) 
      return Math.round(elapsed / minute) + ' minutes ago';

    else if (elapsed < day) 
      return Math.round(elapsed / hour) + ' hours ago';

    else if (elapsed < month) 
      return Math.round(elapsed / day) + ' days ago';

    else if (elapsed < year) 
      return Math.round(elapsed / month) + ' months ago';

    else 
      return fullDate(dateString);  
}

export function approximate(value) {
    const range = ["","K","M","B","T"]
    let i = -1
    do {
        value = value/1000
        i++
    } while (value>=1)
    const approximation = Math.round(value*1000) + range[i]
    return approximation
}
export function expand(value) {
    if (typeof value === "number") {
        console.log(value); 
        return value
    }

    const modifiedValue = value.trim().toUpperCase()
    if (parseInt(modifiedValue)==modifiedValue){
        console.log(modifiedValue);
        return parseInt(modifiedValue)
    }
    const range = {'':1,'K':10**3,'M':10**6,'B':10**9,'T':10**12}
    
    const valueRange = modifiedValue[modifiedValue.length-1]
    console.log(parseInt(modifiedValue) * range[valueRange]);
    return (parseInt(modifiedValue) * range[valueRange])
}

export function smallest(...args) {
    let small = args[0] 
    for (let i = 1; i < args.length; i++) {
        small = args[i]<small ? args[i] : small
    }return small
}
export function largest(...args) {
    let large = args[0] 
    for (let i = 1; i < args.length; i++) {
        large = args[i]>large ? args[i] : large
    }return large
}