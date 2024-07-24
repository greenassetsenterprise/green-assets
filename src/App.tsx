import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import Project from "./components/Project";
import About from "./components/About";
import NotFound from "./components/NotFound";

const App: React.FC = () => {
  return (
    <Router basename="/green-assets">
      <div className="flex flex-col min-h-screen">
        <header>
          <Navbar />
        </header>
        <main className="flex-grow bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Navigate to="/homepage" />} />
              <Route path="/homepage" element={<Homepage />} />
              <Route path="/project" element={<Project />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
        <footer className="bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
              © {new Date().getFullYear()} Green Assets. All Rights Reserved.
            </span>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
