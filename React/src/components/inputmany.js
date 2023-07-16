import React from "react";
import {nanoid} from "nanoid"

export default function InputMany(props) {
    const Tag = ({id}) => {
        function removeTag (id ){
            setTagInput( prev => 
                prev.length!==1  
                ?   prev.filter(ele => ele.props.id!==id )      
                :   prev    
            )
        }
        return(
            <span className="reviewpage--inputtags reviewpage--tag">
                <input 
                    className="searchbar--input" 
                    name={props.name} 
                    placeholder={`Enter a ${props.name}`} 
                />
                <span 
                    className="nobutton"  
                    onClick={()=>removeTag(id)} 
                >  <b>X</b>  </span>
            </span>    
        )
    }

    const [tagInput,setTagInput] = React.useState([<Tag key={nanoid()} id={nanoid()} />])
    const addNewTag = () => {
        setTagInput(prev=>prev.concat(<Tag key={nanoid()} id={nanoid()} />))
    }

    return(
        <div >
            <fieldset 
                className={"reviewpage--tag--container"+(props.className?` ${props.className}`:"")}
                style={props.style}
            >                    
                <legend className="reviewpage--tag">{props.name.charAt(0).toUpperCase()+props.name.slice(1)+"s"}</legend> 
                {tagInput}
                <span key={-1} onClick={addNewTag} className="reviewpage--moretag">
                    <big><b>+</b></big>
                </span>
            </fieldset>
            <small className="gray">{props.desc}</small>
        </div>
    )
}