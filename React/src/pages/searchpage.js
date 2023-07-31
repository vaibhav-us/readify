import React from "react";
import { useLoaderData, useSearchParams} from "react-router-dom";
import Paginate from "../components/paginate";
import SearchTile from "../components/searchtile";
import SuchEmpty from "../components/suchempty";
import { isLogged, postItems } from "../utility";
import { Loading } from "../components/sadpath";

export async function loader({request}) {
    const logged = await isLogged()
    // const url = new URL(request.url)
    // const book= url.searchParams.get('book')
    // const genre= url.searchParams.get('genre')

    // const searchResults =await postItems(
    //     {pageno:1,book,genre},`http://127.0.0.1:8000/searchbooks/`
    // )
    // return {key:book||genre, initialData:searchResults.data}
    return {logged}
}

export default function SearchPage() {
    const {logged} = useLoaderData()
    const searchParam = useSearchParams()[0]
    const [results,setResults] = React.useState({data:[],totalItems:0})
    const [key,setKey] = React.useState('')
    const [loading,setLoading] = React.useState(false)
    const containerRef = React.useRef(null)

    React.useEffect( () => { async function call() {
        let params = Object.fromEntries(searchParam.entries())
        setKey( params.book || params.genre)
        params = {...params, pageno:params.pageno || 1}

        setLoading(true)
        const res = await postItems(
            params,`http://127.0.0.1:8000/searchbooks/`
        )
        setLoading(false)

        setResults({data:res.data,totalItems:res.totalbooks})
      }   call();
    },[searchParam])

    const searchResults =results.data && results.data.map(ele => <SearchTile key={ele.id} logged={logged} {...ele} />)
    return(
        <div ref={containerRef} className="searchpage--container">
            <div className="searchpage--results">
                <h1>Showing Results For "{key}"</h1>
                {!loading
                ?   results.data && results.data.length!==0 
                    ?   <>
                            {searchResults}
                            <Paginate scrollRef={containerRef} totalItems={results.totalItems} itemsPerPage={10}/>
                        </>   
                    :   <SuchEmpty msg={`Couldn't find the book you are looking for? <a href="/contribute">Contribute to us</a>`}/>
                :   <Loading msg="Fetching the details for you"/>
                }
               
            </div>
            
            <div className="searchpage--filter">
                {/* <h4>filter</h4> */}
            </div>
        </div>
    )
}