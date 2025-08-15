import { useContext, useEffect, useState } from "react"
import {differenceInCalendarDays} from 'date-fns'
import axios from "axios"
import { Navigate, useParams } from "react-router-dom"
import { UserContext } from "./UserContext"

export default function BookingWidget({place}){

    const {id} = useParams()

    const [checkOut, setCheckOut] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [amountOfGuests, setamountOfGuests] = useState(1)
    const [name, setName] = useState('')
    const [mobile, setMobile] = useState('')
    const [redirect, setRedirect] = useState('');

    const {user} = useContext(UserContext);

    useEffect(() => {
        if(user){
            setName(user.name)
        }
    }, [user])

    let numberOfDays = 0;
    
        if(checkIn && checkOut){
            numberOfDays = differenceInCalendarDays(new Date(checkOut), new Date(checkIn))
        }

    let finalPrice = numberOfDays * place.price

    async function bookingRequest(ev){
        ev.preventDefault()

        try{
            const response = await axios.post('/booking',{
                checkIn, checkOut, amountOfGuests, name, phone:mobile, place:id, price:finalPrice 
            })
    
            const bookingId = response.data._id;
            setRedirect(`/account/bookings/${bookingId}`)
        }catch(e){
            throw e
        }
    }

    if(redirect){
        return <Navigate to={redirect} />
    }

    return (
        <form onSubmit={bookingRequest} className="bg-white p-4 shadow rounded-2xl">
            <div className="text-2xl text-center">
                Price : ${place.price * (numberOfDays > 0 ? numberOfDays : 1)} for {(numberOfDays > 0 ? numberOfDays : 1)} night
            </div>
            <div className="border rounded-2xl mt-4">
                <div className="flex flex-col sm:flex-row">
                    <div className=" py-3 px-4">
                        <label htmlFor="">Check-in: </label>
                        <input type="date" name="" id="" value={checkIn} onChange={ev => setCheckIn(ev.target.value) } />
                    </div>

                    <div className=" py-3 px-4 border-t sm:border-t-0 sm:border-l">
                        <label htmlFor="">Check-out: </label>
                        <input type="date" name="" id="" value={checkOut} onChange={ev => setCheckOut(ev.target.value) } />
                    </div>
                </div>

                <div className="py-3 px-4 border-t">
                        <label htmlFor="">Guests amount</label>
                        <input type="number" name="" defaultValue={amountOfGuests} onChange={ev => setamountOfGuests(ev.target.value)} id="" />
                </div>

                {numberOfDays > 0 && (
                    <>
                    <div className="py-3 px-4 border-t">
                            <label htmlFor="">Your full name:</label>
                            <input type="text" name="" defaultValue={name} onChange={ev => setName(ev.target.value)} id="" />
                    </div>

                    <div className="py-3 px-4 border-t">
                            <label htmlFor="">Phone number:</label>
                            <input type="tel" name="" defaultValue={mobile} onChange={ev => setMobile(ev.target.value)} id="" />
                    </div>
                    </>

                )}
            </div>
            <button className="primary mt-4">
                Book this place 

                {numberOfDays > 0 && (
                    <span> ({numberOfDays * place.price  }$)</span>
                )}
            </button>
        </form>
    )
}