import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useParams, useLocation } from 'react-router-dom';

interface Course {
    _id: string;
    course: string;
    description: string;
}

const MainPanel = () => {
    const { id } = useParams();
    const location = useLocation();
    const courseData = location.state?.courseData as Course;

    const [years, setYears] = React.useState<string[]>(['2024']);
    const [inputYear, setInputYear] = React.useState<string>('');

    // Fetch years on component mount
    React.useEffect(() => {
        const fetchYears = async () => {
            try {
                const response = await fetch('http://localhost:3000/years');
                const data = await response.json();
                const fetchedYears = data.map((yearObj: { year: string }) => yearObj.year);
                setYears(fetchedYears);
            } catch (error) {
                console.error('Error fetching years:', error);
            }
        };
        fetchYears();
    }, []);

    const handleAddYear = async () => {
        if (inputYear && !years.includes(inputYear)) {
            try {
                const response = await fetch('http://localhost:3000/years', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ year: inputYear })
                });

                if (response.ok) {
                    const newYear = await response.json();
                    setYears([...years, newYear.year]);
                    setInputYear('');
                } else {
                    const errorData = await response.json();
                    alert(errorData.error || 'Failed to add year');
                }
            } catch (error) {
                console.error('Error adding year:', error);
                alert('Failed to add year');
            }
        }
    };

    const handleDeleteYear = async (yearToDelete: string) => {
        try {
            const response = await fetch(`http://localhost:3000/years/${yearToDelete}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setYears(years.filter(year => year !== yearToDelete));
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to delete year');
            }
        } catch (error) {
            console.error('Error deleting year:', error);
            alert('Failed to delete year');
        }
    };

    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h1 className='text-4xl font-bold uppercase text-center'>
                        {courseData ? courseData.course : 'Loading...'}
                    </h1>
                </div>
                <div className="card-body flex flex-col gap-4">
                    <div className='flex gap-1 justify-center container'>
                        <input style={{ width: '200px' }}
                            type="text"
                            placeholder='Enter the date'
                            className='form-control '
                            value={inputYear}
                            onChange={(e) => setInputYear(e.target.value)}
                        />
                        <button
                            className='btn shadow-lg btn-primary'
                            onClick={handleAddYear}
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex  justify-center gap-2 flex-wrap">
                        {years.map((year) => (
                            <div key={year} className="flex gap-2 border-1 border-zinc-300 rounded-lg  p-2">
                                <button className='btn btn-secondary'>{year}</button>
                                <button
                                    className='btn btn-danger'
                                    onClick={() => handleDeleteYear(year)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <div className="card" style={{width:'18rem'}}>
                        <h1 className='text-center'>Jan</h1>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item hover:bg-gray-400  cursor-pointer">Batch 1</li>
                            <li className="list-group-item hover:bg-gray-400 cursor-pointer">Batch 2</li>
                            <li className="list-group-item hover:bg-gray-400 cursor-pointer">Batch 3</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MainPanel;
