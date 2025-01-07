import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // Import axios

interface Course {
  _id: string;
  course: string;
  description: string;
}

const CoursePannal = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ course: '', description: '' });

  const handleAddCourseClick = () => {
    setShowForm(!showForm);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // axios.post('http://localhost:3000/Course', {
    //   course: 'Web Development',
    //   description: '9 months',
    // })
    // .then(response => console.log('Course Added:', response.data))
    // .catch(error => console.error('Error:', error.response?.data || error.message));
    
    try {
      const response = await axios.post('http://localhost:3000/courses', newCourse);
      const addedCourse = response.data;
      setCourses([...courses, addedCourse]);
      setNewCourse({ course: '', description: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000');
        setCourses(response.data);
        console.log(response.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="card">
        <h1 className='card-header text-center uppercase font-bold py-5'>Course Details</h1>
        <button className='btn btn-success max-w-40 mx-auto' onClick={handleAddCourseClick}>Add Course</button>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add New Course</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="course"
                  placeholder="Course Name"
                  value={newCourse.course}
                  onChange={handleInputChange}
                  className="form-control mb-3"
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={newCourse.description}
                  onChange={handleInputChange}
                  className="form-control mb-3"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="d-flex flex-row flex-wrap">
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <div key={course._id || index} className='m-3'>
                <div className='min-w-80 min-h-60 shadow-md hover:shadow-2xl transition-all p-5 rounded-lg'>
                  <h2 className='text-2xl text-center'>{course.course}</h2>
                  <p className='py-2 text-center'>Description: {course.description}</p>
                  <button className='btn btn-primary d-block px-5 mx-auto mt-3'>View</button>
                </div>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CoursePannal;

