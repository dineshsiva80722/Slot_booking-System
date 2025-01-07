const mongoose = require('mongoose');
 
const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/Cybernaut_Slot-Booking', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true,
            useCreateIndex: true
        });
 
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }    
}
module.exports = { connectDB }