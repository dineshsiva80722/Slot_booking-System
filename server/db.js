import mongoose from 'mongoose';

// Student Schema
const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Batch Schema
const BatchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Month Schema
const MonthSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    batches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Year Schema
const YearSchema = new mongoose.Schema({
    year: {
        type: String,
        required: true,
        unique: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'  // Reference to the existing course model
    }],
    months: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Month'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create models
export const Student = mongoose.model('Student', StudentSchema);
export const Batch = mongoose.model('Batch', BatchSchema);
export const Month = mongoose.model('Month', MonthSchema);
export const Year = mongoose.model('Year', YearSchema);

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/Cybernaut_Slot-Booking');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}; 