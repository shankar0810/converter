import React from 'react';

import Navbar from './components/NavBar';
import Footer from './components/Footer';
import RazorPagesAnalyser from './components/RazorPagesAnalyser';


function App() {
  return (
    <div className="App flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <RazorPagesAnalyser />
      </div>
      <Footer />
    </div>
  );
}

export default App;