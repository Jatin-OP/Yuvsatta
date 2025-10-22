// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";

// const blankForm = {
//   name: "",
//   class: "",
//   roll_no: "",
//   father_name: "",
//   date_of_joining: "",
//   contact_no: "",
//   address: "",
// };

// export default function ManageStudents() {
//   const [students, setStudents] = useState([]);
//   const [filterClass, setFilterClass] = useState("");
//   const [editingRoll, setEditingRoll] = useState(null);
//   const [form, setForm] = useState(blankForm);
//   const [loading, setLoading] = useState(false);
//   const [sortBy, setSortBy] = useState(null);
//   const [sortDir, setSortDir] = useState("asc");

//   const load = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:5000/api/students");
//       setStudents(res.data || []);
//     } catch (err) {
//       console.error("Failed to load students", err);
//       alert("Failed to load students");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const classes = useMemo(
//     () =>
//       Array.from(new Set(students.map((s) => s.class).filter(Boolean))).sort(),
//     [students]
//   );

//   const startEdit = (s) => {
//     setEditingRoll(s.roll_no);
//     setForm({
//       name: s.name || "",
//       class: s.class || "",
//       roll_no: s.roll_no || "",
//       father_name: s.father_name || "",
//       date_of_joining: s.date_of_joining || "",
//       contact_no: s.contact_no || "",
//       address: s.address || "",
//     });
//   };

//   const cancelEdit = () => {
//     setEditingRoll(null);
//     setForm(blankForm);
//   };

//   const saveStudent = async () => {
//     if (!form.roll_no || !form.name) {
//       alert("Roll No and Name are required");
//       return;
//     }
//     try {
//       await axios.post("http://localhost:5000/api/students", form);
//       await load();
//       cancelEdit();
//       alert("Saved");
//     } catch (err) {
//       console.error("Save failed", err);
//       const msg = err?.response?.data?.message || err.message;
//       alert("Save failed: " + msg);
//     }
//   };

//   const deleteStudent = async (roll_no) => {
//     if (!window.confirm(`Delete student with Roll No ${roll_no}? This will remove related attendance.`))
//       return;
//     try {
//       const res = await axios.delete(
//         `http://localhost:5000/api/students?roll_no=${encodeURIComponent(roll_no)}`
//       );
//       await load();
//       alert(res.data?.message || "Deleted");
//     } catch (err) {
//       console.error("Delete failed:", err);
//       const serverMessage = err?.response?.data?.message || err?.response?.data || err.message;
//       alert(`Delete failed: ${serverMessage}`);
//     }
//   };

//   const handleSort = (col) => {
//     if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//     else {
//       setSortBy(col);
//       setSortDir("asc");
//     }
//   };

//   const compareValues = (aVal, bVal) => {
//     const a = aVal ?? "";
//     const b = bVal ?? "";
//     const aNum = parseFloat(String(a));
//     const bNum = parseFloat(String(b));
//     if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum;
//     const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//     if (typeof a === "string" && typeof b === "string" && dateRegex.test(a) && dateRegex.test(b))
//       return a.localeCompare(b);
//     return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
//   };

//   const filtered = students.filter((s) => (filterClass ? s.class === filterClass : true));

//   const displayed = useMemo(() => {
//     const arr = [...filtered];
//     if (!sortBy) return arr;
//     arr.sort((x, y) => {
//       const cmp = compareValues(x[sortBy], y[sortBy]);
//       return sortDir === "asc" ? cmp : -cmp;
//     });
//     return arr;
//   }, [filtered, sortBy, sortDir]);

//   const header = (label, key) => (
//     <th
//       onClick={() => handleSort(key)}
//       style={{ cursor: "pointer", userSelect: "none", padding: "6px" }}
//     >
//       {label} {sortBy === key ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
//     </th>
//   );

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Students — View / Filter / Edit / Delete</h2>

//       <div style={{ margin: "12px 0", display: "flex", gap: 12, alignItems: "center" }}>
//         <label><b>Filter by class:</b></label>
//         <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
//           <option value="">All</option>
//           {classes.map((c) => (
//             <option key={c} value={c}>{c}</option>
//           ))}
//         </select>
//         <button onClick={load} style={{ marginLeft: "12px" }}>{loading ? "Loading..." : "Refresh"}</button>
//       </div>

//       <table border="1" cellPadding="6" style={{ width: "100%", borderCollapse: "collapse" }}>
//         <thead style={{ background: "#f2f2f2" }}>
//           <tr>
//             {header("Roll No", "roll_no")}
//             {header("Name", "name")}
//             {header("Class", "class")}
//             {header("Father Name", "father_name")}
//             {header("Join Date", "date_of_joining")}
//             {header("Contact", "contact_no")}
//             {header("Address", "address")}
//             <th style={{ padding: "6px" }}>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {displayed.map((s) =>
//             editingRoll === s.roll_no ? (
//               <tr key={s.roll_no}>
//                 <td><input value={form.roll_no} disabled style={{ width: 90 }} /></td>
//                 <td><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></td>
//                 <td><input value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} /></td>
//                 <td><input value={form.father_name} onChange={(e) => setForm({ ...form, father_name: e.target.value })} /></td>
//                 <td><input type="date" value={form.date_of_joining} onChange={(e) => setForm({ ...form, date_of_joining: e.target.value })} /></td>
//                 <td><input value={form.contact_no} onChange={(e) => setForm({ ...form, contact_no: e.target.value })} /></td>
//                 <td><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></td>
//                 <td>
//                   <button onClick={saveStudent} style={{ marginRight: 6 }}>Save</button>
//                   <button onClick={cancelEdit}>Cancel</button>
//                 </td>
//               </tr>
//             ) : (
//               <tr key={s.roll_no}>
//                 <td>{s.roll_no}</td>
//                 <td>{s.name}</td>
//                 <td>{s.class}</td>
//                 <td>{s.father_name}</td>
//                 <td>{s.date_of_joining}</td>
//                 <td>{s.contact_no}</td>
//                 <td>{s.address}</td>
//                 <td>
//                   <button onClick={() => startEdit(s)} style={{ marginRight: 6 }}>Edit</button>
//                   <button onClick={() => deleteStudent(s.roll_no)} style={{ background: "red", color: "white" }}>Delete</button>
//                 </td>
//               </tr>
//             )
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// // ...existing code...








//                                                              MONGO DB VERSION















// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import "../styles/ManageStudents.css";

// const blankForm = {
//   name: "",
//   class: "",
//   roll_no: "",
//   father_name: "",
//   date_of_joining: "",
//   contact_no: "",
//   address: "",
// };

// export default function ManageStudents() {
//   const [students, setStudents] = useState([]);
//   const [filterClass, setFilterClass] = useState("");
//   const [editingRoll, setEditingRoll] = useState(null);
//   const [form, setForm] = useState(blankForm);
//   const [loading, setLoading] = useState(false);
//   const [sortBy, setSortBy] = useState(null);
//   const [sortDir, setSortDir] = useState("asc");

//   const load = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:5000/api/students");
//       setStudents(res.data || []);
//     } catch (err) {
//       console.error("Failed to load students", err);
//       alert("Failed to load students");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const classes = useMemo(
//     () =>
//       Array.from(new Set(students.map((s) => s.class).filter(Boolean))).sort(),
//     [students]
//   );

//   const startEdit = (s) => {
//     setEditingRoll(s.roll_no);
//     setForm({
//       name: s.name || "",
//       class: s.class || "",
//       roll_no: s.roll_no || "",
//       father_name: s.father_name || "",
//       date_of_joining: s.date_of_joining || "",
//       contact_no: s.contact_no || "",
//       address: s.address || "",
//     });
//   };

//   const cancelEdit = () => {
//     setEditingRoll(null);
//     setForm(blankForm);
//   };

//   const saveStudent = async () => {
//     if (!form.roll_no || !form.name) {
//       alert("Roll No and Name are required");
//       return;
//     }
//     try {
//       await axios.post("http://localhost:5000/api/students", form);
//       await load();
//       cancelEdit();
//       alert("Saved");
//     } catch (err) {
//       console.error("Save failed", err);
//       const msg = err?.response?.data?.message || err.message;
//       alert("Save failed: " + msg);
//     }
//   };

//   const deleteStudent = async (roll_no) => {
//     if (!window.confirm(`Delete student with Roll No ${roll_no}? This will remove related attendance.`))
//       return;
//     try {
//       const res = await axios.delete(
//         `http://localhost:5000/api/students?roll_no=${encodeURIComponent(roll_no)}`
//       );
//       await load();
//       alert(res.data?.message || "Deleted");
//     } catch (err) {
//       console.error("Delete failed:", err);
//       const serverMessage = err?.response?.data?.message || err?.response?.data || err.message;
//       alert(`Delete failed: ${serverMessage}`);
//     }
//   };

//   const handleSort = (col) => {
//     if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//     else {
//       setSortBy(col);
//       setSortDir("asc");
//     }
//   };

//   const compareValues = (aVal, bVal) => {
//     const a = aVal ?? "";
//     const b = bVal ?? "";
//     const aNum = parseFloat(String(a));
//     const bNum = parseFloat(String(b));
//     if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum;
//     const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//     if (typeof a === "string" && typeof b === "string" && dateRegex.test(a) && dateRegex.test(b))
//       return a.localeCompare(b);
//     return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
//   };

//   const filtered = students.filter((s) => (filterClass ? s.class === filterClass : true));

//   const displayed = useMemo(() => {
//     const arr = [...filtered];
//     if (!sortBy) return arr;
//     arr.sort((x, y) => {
//       const cmp = compareValues(x[sortBy], y[sortBy]);
//       return sortDir === "asc" ? cmp : -cmp;
//     });
//     return arr;
//   }, [filtered, sortBy, sortDir]);

//   const header = (label, key) => (
//     <th
//       className="table-head-cell sortable"
//       onClick={() => handleSort(key)}
//       role="button"
//     >
//       <span className="col-label">{label}</span>
//       <span className="sort-indicator">{sortBy === key ? (sortDir === "asc" ? "▲" : "▼") : "↕"}</span>
//     </th>
//   );

//   return (
//     <div className="manage-students">
//       <h2 className="title">Students — View / Filter / Edit / Delete</h2>

//       <div className="controls">
//         <label className="controls-label"><b>Filter by class:</b></label>
//         <select
//           className="filter-select"
//           value={filterClass}
//           onChange={(e) => setFilterClass(e.target.value)}
//         >
//           <option value="">All</option>
//           {classes.map((c) => (
//             <option key={c} value={c}>{c}</option>
//           ))}
//         </select>
//         <button className="btn" onClick={load}>{loading ? "Loading..." : "Refresh"}</button>
//       </div>

//       <div className="table-wrap">
//         <table className="students-table" aria-label="Students table">
//           <thead className="table-header">
//             <tr>
//               {header("Roll No", "roll_no")}
//               {header("Name", "name")}
//               {header("Class", "class")}
//               {header("Father Name", "father_name")}
//               {header("Join Date", "date_of_joining")}
//               {header("Contact", "contact_no")}
//               {header("Address", "address")}
//               <th className="table-head-cell">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {displayed.map((s) =>
//               editingRoll === s.roll_no ? (
//                 <tr className="edit-row" key={s.roll_no}>
//                   <td className="table-cell"><input className="form-input small" value={form.roll_no} disabled /></td>
//                   <td className="table-cell"><input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></td>
//                   <td className="table-cell"><input className="form-input small" value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} /></td>
//                   <td className="table-cell"><input className="form-input" value={form.father_name} onChange={(e) => setForm({ ...form, father_name: e.target.value })} /></td>
//                   <td className="table-cell"><input className="form-input small" type="date" value={form.date_of_joining} onChange={(e) => setForm({ ...form, date_of_joining: e.target.value })} /></td>
//                   <td className="table-cell"><input className="form-input small" value={form.contact_no} onChange={(e) => setForm({ ...form, contact_no: e.target.value })} /></td>
//                   <td className="table-cell"><input className="form-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></td>
//                   <td className="table-cell actions">
//                     <button className="btn" onClick={saveStudent} style={{ marginRight: 6 }}>Save</button>
//                     <button className="btn" onClick={cancelEdit}>Cancel</button>
//                   </td>
//                 </tr>
//               ) : (
//                 <tr className="table-row" key={s.roll_no}>
//                   <td className="table-cell">{s.roll_no}</td>
//                   <td className="table-cell">{s.name}</td>
//                   <td className="table-cell">{s.class}</td>
//                   <td className="table-cell">{s.father_name}</td>
//                   <td className="table-cell">{s.date_of_joining}</td>
//                   <td className="table-cell">{s.contact_no}</td>
//                   <td className="table-cell">{s.address}</td>
//                   <td className="table-cell actions">
//                     <button className="btn" onClick={() => startEdit(s)} style={{ marginRight: 6 }}>Edit</button>
//                     <button className="btn btn-danger" onClick={() => deleteStudent(s.roll_no)}>Delete</button>
//                   </td>
//                 </tr>
//               )
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
// // ...existing code...











// ...existing code...
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/ManageStudents.css";

const blankForm = {
  name: "",
  class: "",
  roll_no: "",
  father_name: "",
  date_of_joining: "",
  contact_no: "",
  address: "",
};

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [filterClass, setFilterClass] = useState("");
  const [searchRoll, setSearchRoll] = useState("");
  const [editingRoll, setEditingRoll] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/students");
      setStudents(res.data || []);
    } catch (err) {
      console.error("Failed to load students", err);
      alert("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const classes = useMemo(
    () =>
      Array.from(new Set(students.map((s) => s.class).filter(Boolean))).sort(),
    [students]
  );

  const startEdit = (s) => {
    setEditingRoll(s.roll_no);
    setForm({
      name: s.name || "",
      class: s.class || "",
      roll_no: s.roll_no || "",
      father_name: s.father_name || "",
      date_of_joining: s.date_of_joining || "",
      contact_no: s.contact_no || "",
      address: s.address || "",
    });
  };

  const cancelEdit = () => {
    setEditingRoll(null);
    setForm(blankForm);
  };

  const saveStudent = async () => {
    if (!form.roll_no || !form.name) {
      alert("Roll No and Name are required");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/students", form);
      await load();
      cancelEdit();
      alert("Saved");
    } catch (err) {
      console.error("Save failed", err);
      const msg = err?.response?.data?.message || err.message;
      alert("Save failed: " + msg);
    }
  };

  const deleteStudent = async (roll_no) => {
    if (!window.confirm(`Delete student with Roll No ${roll_no}? This will remove related attendance.`))
      return;
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/students?roll_no=${encodeURIComponent(roll_no)}`
      );
      await load();
      alert(res.data?.message || "Deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      const serverMessage = err?.response?.data?.message || err?.response?.data || err.message;
      alert(`Delete failed: ${serverMessage}`);
    }
  };

  const handleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(col);
      setSortDir("asc");
    }
  };

  const compareValues = (aVal, bVal) => {
    const a = aVal ?? "";
    const b = bVal ?? "";
    const aNum = parseFloat(String(a));
    const bNum = parseFloat(String(b));
    if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (typeof a === "string" && typeof b === "string" && dateRegex.test(a) && dateRegex.test(b))
      return a.localeCompare(b);
    return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
  };

  // Apply class filter + roll search (partial match)
  // const filtered = students.filter((s) => {
  //   if (filterClass && s.class !== filterClass) return false;
  //   if (searchRoll && !String(s.roll_no).includes(String(searchRoll).trim())) return false;
  //   return true;
  // });
// ...existing code...
  // Apply class filter + roll search (partial match, treat leading zeros as equal e.g. "01" == "1")
const filtered = students.filter((s) => {
    if (filterClass && s.class !== filterClass) return false;

    if (searchRoll) {
      const q = String(searchRoll).trim();
      if (!q) return true;

      // Normalize by removing leading zeros for comparison (so "01" -> "1")
      const qNorm = q.replace(/^0+(?=\d)/, "");
      const sRollStr = String(s.roll_no ?? "");
      const sRollNorm = sRollStr.replace(/^0+(?=\d)/, "");

      // Require exact equality after normalization (or exact original string match)
      if (sRollNorm !== qNorm && sRollStr !== q) return false;
    }

    return true;
  });
// ...existing code...
  const displayed = useMemo(() => {
    const arr = [...filtered];
    if (!sortBy) return arr;
    arr.sort((x, y) => {
      const cmp = compareValues(x[sortBy], y[sortBy]);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortBy, sortDir]);

  const header = (label, key) => (
    <th
      className="table-head-cell sortable"
      onClick={() => handleSort(key)}
      role="button"
    >
      <span className="col-label">{label}</span>
      <span className="sort-indicator">{sortBy === key ? (sortDir === "asc" ? "▲" : "▼") : "↕"}</span>
    </th>
  );

  return (
    <div className="manage-students">
      {/* <h2 className="title">Students — View / Filter / Edit / Delete</h2> */}

      <div className="controls">
        <label className="controls-label"><b>Filter by class:</b></label>
        <select
          className="filter-select"
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
        >
          <option value="">All</option>
          {classes.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label className="controls-label"><b>Search Roll No:</b></label>
        <input
          className="filter-select"
          placeholder="enter roll no"
          value={searchRoll}
          onChange={(e) => setSearchRoll(e.target.value)}
        />

        <button className="btn" onClick={load}>{loading ? "Loading..." : "Refresh"}</button>
      </div>

      <div className="table-wrap">
        <table className="students-table" aria-label="Students table">
          <thead className="table-header">
            <tr>
              {header("Roll No", "roll_no")}
              {header("Name", "name")}
              {header("Class", "class")}
              {header("Father Name", "father_name")}
              {header("Join Date", "date_of_joining")}
              {header("Contact", "contact_no")}
              {header("Address", "address")}
              <th className="table-head-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((s) =>
              editingRoll === s.roll_no ? (
                <tr className="edit-row" key={s.roll_no}>
                  <td className="table-cell"><input className="form-input small" value={form.roll_no} disabled /></td>
                  <td className="table-cell"><input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></td>
                  <td className="table-cell"><input className="form-input small" value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} /></td>
                  <td className="table-cell"><input className="form-input" value={form.father_name} onChange={(e) => setForm({ ...form, father_name: e.target.value })} /></td>
                  <td className="table-cell"><input className="form-input small" type="date" value={form.date_of_joining} onChange={(e) => setForm({ ...form, date_of_joining: e.target.value })} /></td>
                  <td className="table-cell"><input className="form-input small" value={form.contact_no} onChange={(e) => setForm({ ...form, contact_no: e.target.value })} /></td>
                  <td className="table-cell"><input className="form-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></td>
                  <td className="table-cell actions">
                    <button className="btn" onClick={saveStudent} style={{ marginRight: 6 }}>Save</button>
                    <button className="btn" onClick={cancelEdit}>Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr className="table-row" key={s.roll_no}>
                  <td className="table-cell">
                    <Link className="nav-link1 ROLL" to={`/students/${s.roll_no}`}>{s.roll_no}</Link>
                  </td>
                  <td className="table-cell">{s.name}</td>
                  <td className="table-cell">{s.class}</td>
                  <td className="table-cell">{s.father_name}</td>
                  <td className="table-cell">{s.date_of_joining}</td>
                  <td className="table-cell">{s.contact_no}</td>
                  <td className="table-cell">{s.address}</td>
                  <td className="table-cell actions">
                    <button className="btn" onClick={() => startEdit(s)} style={{ marginRight: 6 }}>Edit</button>
                    <button className="btn btn-danger" onClick={() => deleteStudent(s.roll_no)}>Delete</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// ...existing code...