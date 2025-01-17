import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

import axios from 'axios'; // Import axios

interface Course {
  _id: string;
  course: string;
  description: string;
}

const CoursePanel = () => {
  const navigate = useNavigate();
  const handleViewCourse = (course: Course) => {
    navigate(`/course/${course._id}`, {
      state: { courseData: course }
    });
  };


  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ course: '', description: '' });

  // Toggle form visibility
  const handleAddCourseClick = () => {
    setShowForm(!showForm);
  };

  // Handle input change for form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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


  // Delete a course
  const handleCourseDelete = async (_id: string) => {
    try {
      await axios.delete(`http://localhost:3000/courses/${_id}`);
      setCourses(courses.filter((course) => course._id !== _id));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  // Fetch courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="card">
        <h1 className="card-header text-center uppercase font-bold py-5">Course Details</h1>
        <button className="btn btn-success max-w-40 mx-auto" onClick={handleAddCourseClick}>
          Add Course
        </button>

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

        <div className="d-flex place-content-center flex-row flex-wrap">
          {courses === null || courses === undefined ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <div key={course._id} className="m-3 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
                <div className="min-w-80 min-h-60 shadow-md hover:shadow-2xl relative transition-all p-5 rounded-lg">
                  <button
                    onClick={() => handleCourseDelete(course._id)}
                    className="btn shadow-md hover:shadow-2xl absolute right-5 top-3"
                  >
                    Delete
                  </button>
                  <h2 className="text-2xl text-center font-semibold">{course.course}</h2>
                  <p className="py-2 text-center text-gray-600">Description: {course.description}</p>
                  <button
                    className="btn btn-primary d-block px-5 mx-auto mt-3"
                    onClick={() => handleViewCourse(course)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center w-full py-10">
              <p className="text-xl text-gray-600">No courses available.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CoursePanel;
