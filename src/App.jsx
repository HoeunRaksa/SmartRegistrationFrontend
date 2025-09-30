import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Nabar from './Components/Nabar';
import MainRouter from './Router/mainRouter';
import { Footer } from "./Components/Footer";
import "./App.css";
function App() {
  return (

    <Router>
      <div className="fixed top-0 left-0 w-full z-50">
        <Nabar />
      </div>
      <div className=" relative w-auto h-auto py-1 px-4">
        <div className="top-0 left-0 absolute overflow-hidden w-full h-full"></div>
        <MainRouter />
      </div>
      <div className="py-1 px-4">
        <Footer />
      </div>
    </Router>

  )
}

export default App
