import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    course: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Note: 'Course_details' is the exact collection name from MongoDB Compass
export const itemModel = mongoose.model('Course_details', itemSchema, 'Course_details');