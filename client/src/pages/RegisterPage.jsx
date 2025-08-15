import { useState } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios'

function RegisterPage(){
    let[name, setName] = useState('')
    let[email, setEmail] = useState('')
    let[password, setPassword] = useState('')

    async function registerUser(ev){
        ev.preventDefault() // agar tidak refresh ketika submit
        try{
            await axios.post('/register', {
                name,
                email,
                password
            })
    
            alert('WAW kamu berhasil')
        }catch(e){
            alert('ADA MASALAH NICH')
        }
    }
    return(
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Register</h1>

                <form action="" className="max-w-md mx-auto" onSubmit={registerUser}>

                    <input 
                    type="text" 
                    name="username"
                    placeholder="Username" 
                    value={name} 
                    onChange={ev => setName(ev.target.value)} />

                    <input 
                    type="email" 
                    name="email" 
                    placeholder="your@email.com" 
                    value={email} 
                    onChange={ev => setEmail(ev.target.value)}
                    />

                    <input 
                    type="password" 
                    name="password" 
                    placeholder="password"
                    value={password} 
                    onChange={ev => setPassword(ev.target.value)}
                    />

                    <button className="primary">Register</button>
                    <div className='text-center py-2 text-gray-500'>have an account? <Link className='underline font-bold text-primary' to={'/login'} >Login</Link></div>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;