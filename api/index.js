const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const imageDownloader = require('image-downloader');
const multer = require('multer')
const fs = require('fs');
const { title } = require('process');

const app = express();


let bcryptSalt =  bcrypt.genSaltSync(10)
let jwtSecret = 'nc9082bbo237b128ove701fjj382n0c1e0n19c'

app.use(express.json())

app.use(cookieParser())

app.use('/uploads', express.static(__dirname+'/uploads'))

require('dotenv').config()
mongoose.connect(process.env.MONGO_URL)


function getUserDataFromToken(req){

    if(req.cookies.token){
        return new Promise((resolve, reject) => {
            jwt.verify(req.cookies.token, jwtSecret, {}, (err, userData) => {
                if (err) throw err;
    
                resolve(userData)
            })
        })
    }else{
        return null;
    }
}

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}))

app.get('/test', function(req,res) {
    res.json('working');
})

app.post('/register', async function(req, res){
    const {name, email, password} = req.body

    try{
        const userDoc = await User.create({
            name,
            email,
            password:bcrypt.hashSync(password, bcryptSalt),
        })
    
        res.json(userDoc)
    }catch(e){
        res.status(422).json(e);
    }
})

app.post('/login', async function(req, res){
    const {email, password} = req.body

    try{
        const UserDoc = await User.findOne({email})

        if(UserDoc){
            let passOk = bcrypt.compareSync(password, UserDoc.password);
    
            if(passOk){
                jwt.sign({
                    email:UserDoc.email,
                    id:UserDoc._id
                }, jwtSecret, {}, (err, token) => {
                    if(err) throw err;
                    res.cookie('token', token).json(UserDoc)
                })
            }else{
                res.status(422).json('pass salah')
            }
    
        }else{
            res.json("UserNotExist")
        };

    }catch(e){
        
    }
})

app.get('/profile', (req, res) => {
    const {token} = req.cookies

    if(token){
        jwt.verify(token, jwtSecret, {}, async(err, userData) => {
            if(err) throw err;

            const {name, email, _id} = await User.findById(userData.id)

            res.json({name, email, _id});
            
        })
    }else{
        res.json(null)
    }
})

app.get('/user-places', (req,res) => {
    const {token} = req.cookies

    if(token){
        jwt.verify(token, jwtSecret, {}, async(err, userData) => {
            if(err) throw err;

            res.json(await Place.find({owner:userData.id}))
        })
    }
})

app.post('/logout', (req, res) => {

    res.cookie('token', '').json(true)
})

app.post('/upload-by-link', async(req, res) => {
    const {link} = req.body
    const newName = 'photo' +Date.now()+'.jpg'

    const options = {
        url: link,
        dest: __dirname + '/uploads/' + newName
    }

    await imageDownloader.image(options)
            .then(({filename}) => {
                res.json(newName);
            }).catch((err) => console.error(err))
})

const photosMiddleware = multer({dest:'uploads/'})

app.post('/upload', photosMiddleware.array('photos', 100),async(req, res) => {
    const uploadedFiles = [] 
    for(let i = 0; i < req.files.length; i++){
        const {originalname, path} = req.files[i];

        const parts = originalname.split('.')
        const extension = parts[parts.length - 1]

        const newPath = path + '.' + extension;
        

        fs.renameSync(path, newPath)

        const filename = newPath.replace('uploads\\', '');
        uploadedFiles.push(filename)


    }
    res.json(uploadedFiles)
})

app.post('/places', (req,res) => {
    const {token} = req.cookies
    jwt.verify(token, jwtSecret, {}, async(err, userData) => {
        if(err) throw err;

        const {title, address, addedPhotos, description,perks, extraInfo, checkIn, checkOut,maxGuests, price} = req.body

        Place.create({
            owner:userData.id,
            title,
            address,
            photos:addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
            price
        })

        res.json({ok:true})
    })
})

app.get('/places/:id', async(req,res) => {
    const {id} = req.params
    const placeData = await Place.findById(id);
    
    res.json(placeData)
})

app.put('/places', async(req,res) => {
    const {id, title, address, addedPhotos, description,perks, extraInfo, checkIn, checkOut,maxGuests, price} = req.body

    // res.json(id)
    const {token} = req.cookies
    
    jwt.verify(token, jwtSecret, {}, async(err, userData) => { 
        if (err) throw err;
        
        const placeData = await Place.findById(id);
        
        const {id:userId} = userData
        const {owner} = placeData

        if(userId === owner.toString()){
            placeData.set({
                title, address, photos:addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price
            })

            await placeData.save()

            res.json('done')
        }
    })
})

app.get('/places', async(req,res) => {
    res.json(await Place.find())
})

app.post('/booking', async (req, res) => {
    const userData = await getUserDataFromToken(req)
    const {checkIn, checkOut, phone, name, amountOfGuests, place, price} = req.body

    Booking.create({
        checkIn, checkOut, phone, name, amountOfGuests, place, price, user:userData.id
    }).then((doc) => {
        res.json(doc)
    }).catch((err) => {throw err}) 
})

app.get('/user-bookings', async(req, res) => {
    const userData = await getUserDataFromToken(req)

    if(userData){
        res.json(await Booking.find({ user:userData.id }).populate('place'))
    }else{
        res.json(null)
    }

})

app.get('/search', async(req, res) => {
    const {search} = req.query

    if (!search || search.trim() === "") {
    return res.json([]);
}
    

    res.json(await Place.find({title: {$regex: search, $options: 'i'}}))
})
app.listen(4000); 