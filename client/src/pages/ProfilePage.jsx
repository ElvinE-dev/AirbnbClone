import { useContext, useState } from "react"
import { UserContext } from "../UserContext"
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";


export default function AccountPage(){
    let [redirect, setRedirect] = useState(null);
    let {ready, user, setUser} = useContext(UserContext);
    let {subpage} = useParams(); // useParams ini kayak laravel punya router yang /post/{id}

    subpage = subpage === undefined ? 'profile' : subpage

    async function Logout(){
        await axios.post('/logout')
        setRedirect('/')
        setUser(null)
    }

    // Kenapa ga langsung pakai Navigate aja? karena ini async,
    // jadinya semuanya akan terjadi secara bersamaan.

    if(!ready){
        return 'Loading.....'
    }

    if(ready && !user && !redirect){
        return <Navigate to={'/login'}/>
    }

    //Kenapa pakai ready? karena kalau ga ada ready, di render pertama akan null
    //dan otomatis !user akan jadi true yang akan ngetrigger navigate
    //jadi ready di pake buat tau kalau ini orang datanya belum sampe atau emang tak login

    if(redirect){
        return <Navigate to={redirect}/>
    }

    return(


        <div>
            <AccountNav />

            {
                subpage === 'profile' && (
                    <div className="text-center max-w-lg mx-auto">
                        Logged In as {user.name} (user.email)
                        <button onClick={Logout} className="primary max-w-sm mt-2">Logout</button>
                    </div>
                )
            }

            {
                subpage === 'places' && (
                    <PlacesPage />
                )
            }
        </div>
    )
}