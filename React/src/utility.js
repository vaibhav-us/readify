export async function postItems(object,api) {
    const res = await fetch(api, 
        {method : "POST", body: JSON.stringify(object),
        headers:{"Content-Type": "application/json"}}
    )

if (!res.ok) {
  throw {
      message : data.message,
      statusText : res.statusText,
      status : res.status
  }
}
const data = await res.json()
return data
}

export function fullDate(date) {
    const[year,month,day] = date.split("/")
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

export function getCurrentDate() {
    const dateObject = new Date()
    const dateArray = [dateObject.getFullYear(),dateObject.getMonth()+1,dateObject.getDate()] 
    const date = dateArray.join('-')
    console.log(date);
    return date
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