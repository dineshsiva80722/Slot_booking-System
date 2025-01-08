import express from 'express';
import { connectDB, Year, Month, Batch, Student, itemModel } from './db.js';
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

app.post('/courses', async (req, res) => {
  const { course, description } = req.body;

  console.log('Received request body:', req.body);
  console.log('Database connection status:', mongoose.connection.readyState);

  if (!course || !description) {
      console.log('Validation Error: Missing course or description');
      return res.status(400).json({ error: 'Course and description are required' });
  }

  try {
      console.log('Attempting to create new course:', { course, description });
      
      const newCourse = new itemModel({
          course: course,
          description: description
      });

      console.log('Created course model instance:', newCourse);
      
      const savedCourse = await newCourse.save();
      console.log('Successfully saved course:', savedCourse);
      
      res.status(201).json(savedCourse);
  } catch (error) {
      console.error('Detailed error:', {
          message: error.message,
          name: error.name,
          stack: error.stack
      });
      res.status(500).json({ 
          error: 'Failed to save course',
          details: error.message 
      });
  }
});

app.delete('/courses/:id', async (req, res) => {
  const { id } = req.params;

  // Validate the ID format (MongoDB ObjectID)
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format.' });
  }

  try {
      // Delete the course using MongoDB
      const deletedCourse = await itemModel.findByIdAndDelete(id);

      if (!deletedCourse) {
          return res.status(404).json({ error: 'Course not found.' });
      }

      res.status(200).json({ message: 'Course deleted successfully.' });
  } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ error: 'Internal Server Error.' });
  }
});

// GET all years
app.get('/years', async (req, res) => {
    try {
        const years = await Year.find();
        res.json(years);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST a new year
app.post('/years', async (req, res) => {
    try {
        const { year } = req.body;
        
        // Check if year already exists
        const existingYear = await Year.findOne({ year });
        if (existingYear) {
            return res.status(400).json({ error: 'Year already exists' });
        }

        const newYear = new Year({ year });
        const savedYear = await newYear.save();
        res.status(201).json(savedYear);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE a year
app.delete('/years/:year', async (req, res) => {
    try {
        const { year } = req.params;
        const deletedYear = await Year.findOneAndDelete({ year });

        if (!deletedYear) {
            return res.status(404).json({ error: 'Year not found' });
        }

        res.json({ message: 'Year deleted successfully', deletedYear });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Link a course to a year
app.post('/years/:year/courses', async (req, res) => {
    try {
        const { year } = req.params;
        const { courseId } = req.body;

        // Validate inputs
        if (!courseId) {
            return res.status(400).json({ error: 'Course ID is required' });
        }

        // Find the year
        const existingYear = await Year.findOne({ year });
        if (!existingYear) {
            return res.status(404).json({ error: 'Year not found' });
        }

        // Find the course
        const course = await itemModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Check if course is already linked
        if (existingYear.courses.includes(courseId)) {
            return res.status(400).json({ error: 'Course already linked to this year' });
        }

        // Link course to year
        existingYear.courses.push(courseId);
        await existingYear.save();

        // Populate the courses to return full details
        await existingYear.populate('courses');

        res.status(200).json(existingYear);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get courses for a specific year
app.get('/years/:year/courses', async (req, res) => {
    try {
        const { year } = req.params;

        // Find the year and populate its courses
        const existingYear = await Year.findOne({ year }).populate('courses');
        
        if (!existingYear) {
            return res.status(404).json({ error: 'Year not found' });
        }

        res.status(200).json(existingYear.courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove a course from a year
app.delete('/years/:year/courses/:courseId', async (req, res) => {
    try {
        const { year, courseId } = req.params;

        // Find the year
        const existingYear = await Year.findOne({ year });
        if (!existingYear) {
            return res.status(404).json({ error: 'Year not found' });
        }

        // Remove the course
        existingYear.courses = existingYear.courses.filter(
            course => course.toString() !== courseId
        );

        await existingYear.save();

        res.status(200).json({ message: 'Course removed from year', year: existingYear });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get years for a specific course
app.get('/courses/:courseId/years', async (req, res) => {
    try {
        const { courseId } = req.params;

        // Find years that have this course linked
        const years = await Year.find({ 
            courses: mongoose.Types.ObjectId(courseId) 
        });

        res.status(200).json(years);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new year for a specific course
app.post('/courses/:courseId/years', async (req, res) => {
    try {
        const { courseId } = req.params;
        const { year } = req.body;

        // Create a new year with the course reference
        const newYear = new Year({
            year,
            course: courseId,
            months: [] // Initialize with empty months array
        });

        // Create default months for the year
        const defaultMonths = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const monthDocuments = await Promise.all(
            defaultMonths.map(async (monthName) => {
                const month = new Month({
                    name: monthName,
                    batches: []
                });
                return await month.save();
            })
        );

        // Link months to the year
        newYear.months = monthDocuments.map(month => month._id);

        await newYear.save();

        res.status(201).json(newYear);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get years for a specific course with populated months
app.get('/courses/:courseId/years', async (req, res) => {
    try {
        const { courseId } = req.params;
        const years = await Year.find({ course: courseId }).populate({
            path: 'months',
            populate: {
                path: 'batches',
                populate: {
                    path: 'students'
                }
            }
        });
        res.status(200).json(years);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new batch for a specific month
app.post('/months/:monthId/batches', async (req, res) => {
    try {
        const { monthId } = req.params;
        const { batchName } = req.body;

        // Create a new batch
        const newBatch = new Batch({
            name: batchName,
            students: []
        });
        await newBatch.save();

        // Add batch to the month
        const month = await Month.findById(monthId);
        if (!month) {
            return res.status(404).json({ error: 'Month not found' });
        }

        month.batches.push(newBatch._id);
        await month.save();

        res.status(201).json(newBatch);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a student to a specific batch
app.post('/batches/:batchId/students', async (req, res) => {
    try {
        const { batchId } = req.params;
        const { name, email, phone } = req.body;

        // Create a new student
        const newStudent = new Student({
            name,
            email,
            phone
        });
        await newStudent.save();

        // Add student to the batch
        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }

        batch.students.push(newStudent._id);
        await batch.save();

        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});