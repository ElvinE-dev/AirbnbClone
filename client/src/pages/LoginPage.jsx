import axios from 'axios';
import { useState } from 'react';
import {Link, Navigate} from 'react-router-dom';
import {UserContext} from '../UserContext.jsx'
import { useContext } from 'react';

function LoginPage(){

        let[email, setEmail] = useState('')
        let[password, setPassword] = useState('')
        let [redirect, setRedirect] = useState(false);

        const {setUser} = useContext(UserContext)

        async function handleLoginSubmit(ev){
            ev.preventDefault();

            try{

                const {data} = await axios.post('/login', {
                    email,
                    password
                })

                setUser(data)
    
                setRedirect(true)
            }catch(e){
                alert('Failed')
                console.log(e)
            }

        }

        if(redirect){
            return <Navigate to={'/'} />;
        }

    return(
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Login</h1>

                <form action="" className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>

                    <input type="email" name="email" id="email" placeholder="your@email.com" 
                    value={email} 
                    onChange={ev => setEmail(ev.target.value)} 
                    />

                    <input type="password" name="password" placeholder="password" id="pass" 
                    value={password} 
                    onChange={ev => setPassword(ev.target.value)} 
                    />
                    <button className="primary">Login</button>
                    <div className='text-center py-2 text-gray-500'>dont have an account? <Link className='underline font-bold text-primary' to={'/register'} >Register</Link></div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;