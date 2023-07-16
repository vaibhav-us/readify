import React from "react";
import { useSearchParams} from "react-router-dom";
import Paginate from "../components/paginate";
import SearchTile from "../components/searchtile";
import SuchEmpty from "../components/suchempty";
import { postItems } from "../utility";
import { Loading } from "../components/sadpath";

export async function loader({request}) {
    // const url = new URL(request.url)
    // const book= url.searchParams.get('book')
    // const genre= url.searchParams.get('genre')

    // const searchResults =await postItems(
    //     {pageno:1,book,genre},`http://127.0.0.1:8000/searchbooks/`
    // )
    // return {key:book||genre, initialData:searchResults.data}
    return null
}

export default function SearchPage() {
    const searchParam = useSearchParams()[0]
    const [data,setData] = React.useState()
    const [key,setKey] = React.useState('')
    const [loading,setLoading] = React.useState(false)
    const containerRef = React.useRef(null)
    const totalItems=10
    const msgForSuchEmpty = { __html: `Couldn't find the book you are looking for? <a href="/contribute">Contribute to us</a>`}
    
    React.useEffect( () => { async function call() {
        let params = Object.fromEntries(searchParam.entries())
        setKey( params.book || params.genre)
        params = {...params, pageno:params.pageno || 1}

        setLoading(true)
        const searchResults = await postItems(
            params,`http://127.0.0.1:8000/searchbooks/`
        )
        setLoading(false)

        setData(searchResults.data)
      }   call();
    },[searchParam])

    const searchResults =data && data.map(ele => <SearchTile key={ele.id} {...ele}/>)
    return(
        <div ref={containerRef} className="searchpage--container">
            <div className="searchpage--results">
                <h1>Showing Results For "{key}"</h1>
                {!loading
                ?   data && data.length!==0 
                    ?   <>
                            {searchResults}
                            <Paginate scrollRef={containerRef} totalItems={totalItems} itemsPerPage={3}/>
                        </>   
                    :   <SuchEmpty msg={msgForSuchEmpty}/>
                :   <Loading msg="Fetching the details for you"/>
                }
               
            </div>
            
            <div className="searchpage--filter">
                <h4>filter</h4>
            </div>
        </div>
    )
}