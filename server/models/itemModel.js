const itemSchema = new mongoose.Schema({
    course: String,
    description: String
});

const Course = mongoose.model('Course_details', courseSchema);
