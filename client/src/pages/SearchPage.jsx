import axios from "axios";
import { useState } from "react"
import PlaceLink from "../PlaceLink";

export default function SearchPage(){
    const [search, setSearch] = useState('')
    const [places, setPlaces] = useState({});

    return(
        <div className="flex flex-col">
            <div className="my-6">
            <input type="text" value={search} onChange={(ev) => {
                const value =  ev.target.value

                setSearch(value)

                axios.get('/search', {
                    params: {
                        search:value
                    }
                }).then((res) => {
                    setPlaces(res.data)
                })

            }} />
            </div>

            <div className="gap-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-6">
                {places && places.length > 0 && places.map(place => (
                    <PlaceLink place={place} key={place._id}/>
                ))}
            </div>


            
        </div>
    )
}