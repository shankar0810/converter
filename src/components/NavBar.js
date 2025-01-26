import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import logo from './images/ustlogo.svg';

function Navbar() {
    return (
        <div className="flex items-center justify-between bg-teal-700 p-4 px-10">
            <div className="logo">
                <img src={logo} alt="Company Logo" className="h-12" />
            </div>
            <div className="flex space-x-6">
                {/* Navigation Links */}
                <Link
                    to="/analyse"
                    className="text-white hover:text-teal-300 transition-colors duration-300"
                >
                    Analyse
                </Link>
                <Link
                    to="/convert"
                    className="text-white hover:text-teal-300 transition-colors duration-300"
                >
                    Convert
                </Link>
            </div>
            <div className="flex flex-row items-center">
                <img
                    className="w-10 h-10 rounded-full ml-4"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToiRnzzyrDtkmRzlAvPPbh77E-Mvsk3brlxQ&s"
                    alt="Rounded avatar"
                />
            </div>
        </div>
    );
}

export default Navbar;
