import React from 'react';
import { Link } from 'react-router-dom';
import notfound from '../assets/notfound.png'

function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-white to-cyan-200 text-center">
            <div className="mb-8">
                {/* Illustration or mascot */}
                <img
                    src={notfound} // Replace with your mascot image path
                    alt="Not Found"
                    className="w-[45rem] h-[45rem]"
                />
            </div>
            <div className="mb-8 relative -top-20"> {/* Adjust the position upwards */}
                <h1 className="text-5xl font-extrabold text-gray-800">404</h1>
                <p className="text-xl font-medium text-gray-600 mt-2">
                    Oops! The page you’re looking for doesn’t exist.
                </p>
                <p className="text-md text-gray-500 mt-4">
                    But don’t worry, you can explore more from here.
                </p>
                <div className="mt-6">
                    <Link
                        to="/"
                        className="px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-lg"
                    >
                        Go Back Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
