import express from 'express';
import { connectDB } from './db.js';
import { itemModel } from './model/item.js';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.get('/', async (req, res) => {
    try {
        console.log('Connected to database:', mongoose.connection.name);

        const items = await itemModel.find().lean();
        console.log('Query attempted on collection:', itemModel.collection.name);
        console.log('Found items:', items);

        if (items.length === 0) {
            console.log('Warning: No items found in collection');
        }

        res.json(items);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});
let courses = [];

// POST Endpoint for `/courses`
app.post('/courses', (req, res) => {
  const { course, description } = req.body;

  if (!course || !description) {
    return res.status(400).json({ error: 'Course and description are required' });
  }

  const newCourse = { id: courses.length + 1, course, description };
  courses.push(newCourse);

  res.status(201).json(newCourse);
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});