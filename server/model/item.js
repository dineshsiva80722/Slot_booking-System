import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    course: String,
    description: String
});

// Note: 'Course_details' is the exact collection name from MongoDB Compass
export const itemModel = mongoose.model('Course_details', itemSchema, 'Course_details');