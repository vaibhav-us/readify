import React from "react";
import {useParams} from 'react-router-dom';

export default function MoviePage() {
    const {movieId} = useParams()
    return(
        <div>
            <h1>The movie id is {movieId}</h1>
        </div>
    )
}