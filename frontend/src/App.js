// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import AddStudent from "./pages/AddStudent";
// import TakeAttendance from "./pages/TakeAttendance";
// import ViewAttendance from "./pages/ViewAttendance";
// import ManageStudents from "./pages/ManageStudents"; // new
// import Navbar from "./components/Navbar";
// function App() {
//   return (
//     <Router>
      
//       <Navbar />
//       <Routes>
//         <Route path="/add-student" element={<AddStudent />} />
//         <Route path="/attendance" element={<TakeAttendance />} />
//         <Route path="/view-attendance" element={<ViewAttendance />} />
//         <Route path="/students" element={<ManageStudents />} /> {/* new */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// ...existing code...
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddStudent from "./pages/AddStudent";
import TakeAttendance from "./pages/TakeAttendance";
import ViewAttendance from "./pages/ViewAttendance";
import ManageStudents from "./pages/ManageStudents";
import StudentDetails from "./pages/StudentDetails"; // new
import Navbar from "./components/Navbar";
import "./styles/Navbar.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/attendance" element={<TakeAttendance />} />
        <Route path="/view-attendance" element={<ViewAttendance />} />
        <Route path="/students" element={<ManageStudents />} />
        <Route path="/students/:roll_no" element={<StudentDetails />} /> {/* new */}
      </Routes>
    </Router>
  );
}

export default App;
// ...existing code...