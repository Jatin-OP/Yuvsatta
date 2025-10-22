// import React, { useState } from "react";
// import axios from "axios";
// import "../styles/AddStudent.css";  
// export default function AddStudent() {
//   const [form, setForm] = useState({
//     name: "", class: "", roll_no: "", father_name: "",
//     date_of_joining: "", contact_no: "", address: ""
//   });

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await axios.post("http://localhost:5000/api/students", form);
//     alert("✅ Student added successfully!");
//     setForm({ name: "", class: "", roll_no: "", father_name: "", date_of_joining: "", contact_no: "", address: "" });
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Add New Student</h2>
//       <form onSubmit={handleSubmit}>
//         {Object.keys(form).map((key) => (
//           <div key={key}>
//             <label>{key.replace("_", " ")}:</label>
//             <input name={key} value={form[key]} onChange={handleChange} required />
//           </div>
//         ))}
//         <button type="submit">Add Student</button>
//       </form>
//     </div>
//   );
// }
// ...existing code...
import React, { useState } from "react";
import axios from "axios";
import "../styles/AddStudent.css";

export default function AddStudent() {
  const [form, setForm] = useState({
    name: "",
    class: "",
    roll_no: "",
    father_name: "",
    date_of_joining: "",
    contact_no: "",
    address: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const inputType = (key) =>
    key === "date_of_joining" ? "date" : key === "contact_no" ? "tel" : key === "roll_no" ? "number" : "text";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/students", form);
      alert("✅ Student added successfully!");
      setForm({
        name: "",
        class: "",
        roll_no: "",
        father_name: "",
        date_of_joining: "",
        contact_no: "",
        address: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add student");
    }
  };

  return (
    <div className="add-student">
      <h2 className="title">Add New Student</h2>
      <form onSubmit={handleSubmit} className="student-form">
        {Object.keys(form).map((key) => (
          <div className="form-group" key={key}>
            <label className="form-label">{key.replace("_", " ")}:</label>
            <input
              className="form-input"
              name={key}
              value={form[key]}
              onChange={handleChange}
              required
              type={inputType(key)}
            />
          </div>
        ))}
        <button type="submit" className="btn">Add Student</button>
      </form>
    </div>
  );
}
