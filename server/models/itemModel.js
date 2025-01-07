const itemSchema = new mongoose.Schema({
    course: String,
    description: String
});

const itemModel = mongoose.model('Course_details', itemSchema); 