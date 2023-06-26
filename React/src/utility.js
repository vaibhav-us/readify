
export function fullDate(date) {
    const[year,month,day] = date.split("/")
    const dateObject = new Date(year,month-1,day)
    const options = {year:"numeric",month:"long",day:"numeric"}
    return dateObject.toLocaleDateString('en-US',options)
}