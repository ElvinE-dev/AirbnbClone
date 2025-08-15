import {Link} from 'react-router-dom'
import Header from '../Header';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PlaceLink from '../PlaceLink';


function IndexPage(){
    const [places, setPlaces] = useState([])
    useEffect(() => {
        axios.get('/places').then((res) => {
            setPlaces(res.data)
        })
    }, [])

    return(
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8 gap-x-6 gap-y-8'>
            {places.length > 0 && (
                places.map((place) => {
                    return(
                        // <Link to={'/place/'+place._id} key={place._id}>
                        //     <div className='bg-gray-500 rounded-2xl flex mb-2'>
                        //         {place.photos?.[0] && (
                        //             <img className='rounded-2xl object-cover aspect-square' src={'http://localhost:4000/uploads/'+place.photos[0]} alt="" />
                        //         )
                        //         }
                        //     </div>
                        //     <h3 className='font-bold lead'>{place.address}</h3>
                        //     <h2 className='text-sm text-gray-500'>{place.title}</h2>
                        //     <div className='mt-1'>
                        //         <span className='font-bold'> ${place.price} </span> per night
                        //     </div>
                        // </Link>
                        <PlaceLink place={place} key={place._id}/>
                    )
                })
            )}
        </div>
    )
}

export default IndexPage;