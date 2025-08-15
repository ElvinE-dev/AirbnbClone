import { useContext, useEffect, useState } from "react"
import { Navigate, useParams } from "react-router-dom"
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import axios from "axios";
import { differenceInCalendarDays, format } from "date-fns";
import BookingDates from "../BookingDates";
import { UserContext } from "../UserContext";

export default function BookingPage(){
    const {id} = useParams()
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        if(id){
            console.log(id)
            axios.get('/user-bookings').then(res => {
                const foundBooking = res.data.find(({_id}) => _id === id)
                if(foundBooking){
                    setBooking(foundBooking)
                }
            })
        }
    }, [])

    if(!booking){
        return <div>Loading...</div>
    }

    return(
        <div className="my-8">
            <h1 className="text-3xl">{booking.place.title}</h1>
            <AddressLink className={'my-2 block'}>{booking.place.address}</AddressLink>
            <div className="bg-gray-200 p-6 my-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between">
                <div>
                    <h2 className="text-2xl mb-4">Your booking information</h2>

                    <BookingDates booking={booking}/>
                </div>

                <div className="bg-primary w-full h-24 flex flex-col items-center justify-center mt-4 sm:w-fit sm:block sm:p-6 text-white rounded-2xl">
                    <div>Total Price</div>
                    <div className="text-3xl">${booking.price}</div>
                </div>

            </div>
            <PlaceGallery place={booking.place}/>
            
        </div>
    )
}