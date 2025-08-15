import {Link, useParams} from 'react-router-dom';
import AccountNav from '../AccountNav';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PlaceImg from '../PlaceImg';

export default function PlacesPage(){
    const {action} = useParams();
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        axios.get('/user-places').then((res) => {
            setPlaces(res.data)
        })
    }, [])

    //kalo ga ada [] nya bakal jalan terus makanya biar jalannya cuma sekali kita pake []

    return (
        <div>
            <AccountNav />
                <div className="text-center">
                    <Link className ="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>

                    Add Places
                    </Link>
                </div>

                <div className="mt-4 flex flex-col gap-4">
                    {places.length > 0 && (
                        places.map(place => {
                            return(
                                <Link to={'/account/places/'+place._id} className="flex flex-col sm:flex-row cursor-pointer bg-gray-100 p-4 rounded-2xl gap-4" key={place._id}>
                                    <div className='flex w-full overflow-hidden aspect-square sm:w-32 sm:h-32 bg-gray-300 grow-0 shrink-0 rounded-2xl'>
                                        <PlaceImg place={place}/>
                                    </div>
                                    <div className='grow-0 shrink'>
                                        <h2 className='text-xl'>{place.title}</h2>
                                        <p className='text-sm mt-2'>{place.description}</p>
                                    </div>
                                    {console.log(place)}
                                </Link>
                            )
                        })
                    )}
                </div>
        </div>
    )
}