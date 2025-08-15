import { useContext, useEffect, useState } from "react";
import Perks from "../Perks";
import PhotosUploader from "../PhotosUploader";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function PlacesFormPage(){

    const {id} = useParams()

    const {user, ready} = useContext(UserContext);
    
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setaddedPhotos] = useState([]);
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [price, setPrice] = useState(5);
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
        if(!id) return;

        axios.get('/places/'+id).then(res => {
            const {data} = res

            setTitle(data.title)
            setAddress(data.address)
            setaddedPhotos(data.photos)
            setDescription(data.description)
            setPerks(data.perks)
            setExtraInfo(data.extraInfo)
            setCheckIn(data.checkIn)
            setCheckOut(data.checkOut)
            setMaxGuests(data.maxGuests)
            setPrice(data.price)
        });
    }, [id])

        
    function inputHeader(text){
        return(
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }

    function inputDescription(text){
        return(
            <p className="text-gray-500 text-sm">{text}</p>
        )
    }

    function preInput(header, description){
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        )
    }

    async function savePlace(ev){
        const placeData = {
            title, address, addedPhotos,
            description, perks, extraInfo,
            checkIn, checkOut, maxGuests, price
        }
        ev.preventDefault()

        try{
            if(id){
                await axios.put('/places', {id, ...placeData});

            }else{
                await axios.post('/places', placeData);
            }
    
            setRedirect(true);
    
        }catch(err){
            console.error(err)
        }
    }

    if(!user && ready){
        return <Navigate to={'/login'} />
    }



    if(redirect){
        return <Navigate to={'/account/places'} />
    }
    return(

        <div>
            <AccountNav />
        <form onSubmit={savePlace}>
            {preInput('Title', 'Title for your place, should be short and catchy')}
            <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title, Example : An ufo themed building" />

            {preInput('Address', 'Address to your place')}
            <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="address" />

            {preInput('Photos', 'More = Better')}
            <PhotosUploader addedPhotos={addedPhotos} onChange={setaddedPhotos} />


            {preInput('Description', 'Description of your place')}
            <textarea value={description} onChange={ev => setDescription(ev.target.value)}/>


            {preInput('Perks', 'Select all perks that your place got')}
            <Perks selected={perks} onChange={setPerks}/>


            {preInput('Extra Info', 'House rules, etc')}
            <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)}/>

            {preInput('Check in&out time, max guests', 'add check in&out times, remember to have some time window for cleaning between guests')}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                <div> 
                    <h3 className="m4-2 -mb-1">Check in time</h3>
                    <input value={checkIn} onChange={ev => setCheckIn(ev.target.value)} type="text" placeholder='14'/>
                </div>
                <div>
                    <h3 className="m4-2 -mb-1">Check out time</h3>
                    <input value={checkOut} onChange={ev => setCheckOut(ev.target.value)} type="text" placeholder='12'/>
                </div>

                <div>
                    <h3 className="m4-2 -mb-1">Max number of guests</h3>
                    <input value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)} type="number"/>
                </div>

                <div>
                    <h3 className="m4-2 -mb-1">Price Per Night</h3>
                    <input value={price} onChange={ev => setPrice(ev.target.value)} type="number"/>
                </div>
            </div>
            
            <button className="primary my-4">Save </button>


        </form>
        </div>
    )

}