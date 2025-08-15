import { Link } from "react-router-dom";

export default function PlaceLink({place}){
    return (
        <Link to={'/place/'+place._id}>
            <div className='bg-gray-500 rounded-2xl flex mb-2'>
                {place.photos?.[0] && (
                    <img className='rounded-2xl object-cover aspect-square' src={'http://localhost:4000/uploads/'+place.photos[0]} alt="" />
                )
                }
            </div>
            <h3 className='font-bold lead'>{place.address}</h3>
            <h2 className='text-sm text-gray-500'>{place.title}</h2>
            <div className='mt-1'>
                <span className='font-bold'> ${place.price} </span> per night
            </div>
        </Link>
    )
}