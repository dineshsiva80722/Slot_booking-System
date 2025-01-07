import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import CoursePannal from './components/CoursePannal'

function App() {
  const [data, setData] = useState([]);
  // get data
  // useEffect(() => {
  //   axios.get('https://reqres.in/api/users?page=2')
  //     .then(res => setData(res.data.data))
  //     .catch(err => console.log(err));
  // }, [])



  // post data
  // useEffect(() => {
  //   axios.post('https://reqres.in/api/users', {
  //     "name": "Dinesh",
  //     "job": "developer"
  //   })
  //     .then(res => console.log(res))
  //     .catch(err => console.log(err));
  // }, [])

  // put data
  // useEffect(() => {
  //   axios.put('https://reqres.in/api/users/2', {
  //     "name": "Dinesh siva",
  //     "job":  "web developer"
  //   })
  //     .then(res => console.log(res))
  //     .catch(err => console.log(err));
  // }, [])
  // delete data
  // useEffect(() => {
  //   axios.delete('https://reqres.in/api/users/2')
  //     .then(res => console.log(res))
  //     .catch(err => console.log(err));
  // }, [])

  // useEffect(() => {
  //   const fetchdata = async () => {
  //   const res = await fetch('http://localhost:3000');
  //   const data = await res.json();
  //   console.log(data);
  //   }
    
  //   fetchdata();
  // }, [])

  return (
    <>
      <CoursePannal />
    </>
  )
}

export default App
