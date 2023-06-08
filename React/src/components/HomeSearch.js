import React from "react";
import {nanoid} from "nanoid"

export default function HomeSearch () {
    const genre=[
        "Action and Adventure","Horror","Classic",'Comedy','Art','Biography','Business',
        "Children's",'Comics','Cookbooks','Crime','Fantasy','Fiction','Graphic Novel','Historical Fiction','History',
        'Memoir','Music','Mystery','Non-fiction','Paranormal','Philosophy','Peotry','Psychology','Travel',
        'Romance','Religion','Science Fiction','Science','Self Help','Suspense','Spirituality','Sports','Thriller'
    ]

    return(
        <div className="homesearch">
            <h1>Search Books By Genre</h1>
            <ul className="homesearch--genre">
                {genre.map(ele => (<li key={nanoid()}>{ele}</li>))}
            </ul>
        </div>
    )
}