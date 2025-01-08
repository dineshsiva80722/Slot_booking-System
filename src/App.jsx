import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CoursePannal from './components/CoursePannal'
import MainPannel from './components/MainPannel'
import React from 'react';
function App() {


  return (
    <>
       <BrowserRouter>
      <Routes>
        <Route path="/" element={<CoursePannal />} />
        <Route path="/course/:courseId" element={<MainPannel />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
