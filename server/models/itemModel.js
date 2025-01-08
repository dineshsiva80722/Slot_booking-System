const itemSchema = new mongoose.Schema({
    course:{ type: String, required: true },
    description:{ type: String, required: true }
});

const Course = mongoose.model('Course_details', courseSchema);
