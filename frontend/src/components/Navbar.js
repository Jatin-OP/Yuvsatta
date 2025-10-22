// import React from "react";
// import { Link } from "react-router-dom";

// export default function Navbar() {
//   return (
//     <nav style={{ padding: "10px", background: "#007bff", color: "white" }}>
//       <Link to="/" style={{ color: "white", marginRight: "15px" }}>Add Student</Link>
//       <Link to="/attendance" style={{ color: "white" }}>Take Attendance</Link>
//     </nav>
//   );
// }
// // ...existing code...
// import React from "react";
// import { Link } from "react-router-dom";
// import "../styles/Navbar.css";

// export default function Navbar() {
//   return (
//     <nav className="navbar" role="navigation" aria-label="Main navigation">
//       <div className="nav-inner">
//         <div className="nav-links">
//                 <div className="p-4 bg-blue-100 flex gap-4">
//                   <Link to="/add-student" className="font-semibold text-blue-700">
//                     ➕ Add Student
//                   </Link>
//                   <Link to="/attendance" className="font-semibold text-blue-700">
//                     ✅ Take Attendance
//                   </Link>
//                   <Link to="/view-attendance" className="font-semibold text-blue-700">
//                     📊 View Attendance
//                   </Link>
//                   <Link to="/students" className="font-semibold text-blue-700">
//                     🧑‍🎓 Manage Students
//                   </Link>
//                 </div>
//         </div>
//       </div>
//     </nav>
//   );
// }
// ...existing code...

// ...existing code...
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="nav-inner">
        <Link to="/students" className="nav-brand">🧾 Attendance Recorder</Link>

        <div className="nav-links">
          <Link to="/add-student" className="nav-link">➕ Add Student</Link>
          <Link to="/attendance" className="nav-link">✅ Take Attendance</Link>
          <Link to="/view-attendance" className="nav-link">📊 View Attendance</Link>
          <Link to="/students" className="nav-link">🧑‍🎓 Manage Students</Link>
        </div>
      </div>
    </nav>
  );
}
// ...existing code...