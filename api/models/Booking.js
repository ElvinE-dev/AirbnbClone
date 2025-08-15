const mongoose = require('mongoose')

const bookingSchema = mongoose.Schema({
    place: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'Place'}, 
    // ref dipake buat ambil data tanpa harus request lagi,
    // jadi kek dia langsung ambil datanya dari referencenya which is id.
    user: {type:mongoose.Schema.Types.ObjectId, required:true},
    checkIn: {type:Date, required:true},
    checkOut: {type:Date, required:true},
    amountOfGuests: {type:Number, required:true},
    phone: {type:String, required:true},
    name: {type:String, required:true},
    price: Number
})


bookingModel = mongoose.model('Booking', bookingSchema);

module.exports = bookingModel; 