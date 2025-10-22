// // import React, { useEffect, useState } from "react";
// // import axios from "axios";

// // export default function TakeAttendance() {
// //   const [students, setStudents] = useState([]);
// //   const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
// //   const [attendance, setAttendance] = useState({});

// //   const getIdKey = (s) => {
// //     // prefer explicit id, fallback to student_id, roll_no or a composite key so it's unique
// //     return String(s.id ?? s.student_id ?? s.roll_no ?? `${s.name}-${s.class}`);
// //   };

// //   // Load attendance + students for selected date
// //   useEffect(() => {
// //     if (date) {
// //       axios
// //         .get(`http://localhost:5000/api/attendance?date=${date}`)
// //         .then((res) => {
// //           setStudents(res.data);
// //           const att = {};
// //           res.data.forEach((s) => {
// //             const key = getIdKey(s);
// //             att[key] = s.status === "Present";
// //           });
// //           setAttendance(att);
// //         })
// //         .catch((err) => console.error("Error loading data:", err));
// //     }
// //   }, [date]);

// //   const toggleAttendance = (idKey) => {
// //     setAttendance((prev) => ({ ...prev, [idKey]: !prev[idKey] }));
// //   };

// //   const saveAttendance = async () => {
// //     for (let [idKey, present] of Object.entries(attendance)) {
// //       const status = present ? "Present" : "Absent";
// //       // try to send numeric id if it looks numeric
// //       const student_id = isNaN(Number(idKey)) ? idKey : Number(idKey);
// //       await axios.post("http://localhost:5000/api/attendance", {
// //         student_id,
// //         date,
// //         status,
// //       });
// //     }
// //     alert("✅ Attendance saved!");
// //   };

// //   const deleteAttendance = async () => {
// //     if (!window.confirm(`Delete all attendance for ${date}?`)) return;
// //     await axios.delete(`http://localhost:5000/api/attendance?date=${date}`);
// //     alert("🗑️ Attendance deleted!");
// //     setAttendance({});
// //     // reload data
// //     const res = await axios.get(`http://localhost:5000/api/attendance?date=${date}`);
// //     setStudents(res.data);
// //   };

// //   return (
// //     <div style={{ padding: "20px" }}>
// //       <h2>📋 Take / Edit Attendance</h2>

// //       <div style={{ marginBottom: "10px" }}>
// //         <label><b>Date:</b></label>{" "}
// //         <input
// //           type="date"
// //           value={date}
// //           onChange={(e) => setDate(e.target.value)}
// //           style={{ marginLeft: "10px" }}
// //         />
// //       </div>

// //       <table border="1" cellPadding="6" style={{ width: "100%", borderCollapse: "collapse" }}>
// //         <thead style={{ background: "#f2f2f2" }}>
// //           <tr>
// //             <th>Roll No</th>
// //             <th>Name</th>
// //             <th>Class</th>
// //             <th>Present?</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {students.map((s) => {
// //             const key = getIdKey(s);
// //             return (
// //               <tr key={key}>
// //                 <td>{s.roll_no}</td>
// //                 <td>{s.name}</td>
// //                 <td>{s.class}</td>
// //                 <td style={{ textAlign: "center" }}>
// //                   <input
// //                     type="checkbox"
// //                     // ensure we use the normalized key here
// //                     checked={!!attendance[key]}
// //                     onChange={() => toggleAttendance(key)}
// //                     name={`att-${key}`}
// //                   />
// //                 </td>
// //               </tr>
// //             );
// //           })}
// //         </tbody>
// //       </table>

// //       <div style={{ marginTop: "15px" }}>
// //         <button onClick={saveAttendance} style={{ marginRight: "10px" }}>
// //           💾 Save Attendance
// //         </button>
// //         <button onClick={deleteAttendance} style={{ background: "red", color: "white" }}>
// //           🗑️ Delete Attendance
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }


// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";

// export default function TakeAttendance() {
//   const [students, setStudents] = useState([]);
//   const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
//   const [attendance, setAttendance] = useState({});
//   const [sortBy, setSortBy] = useState(null);
//   const [sortDir, setSortDir] = useState("asc");

//   const getIdKey = (s) => String(s.id ?? s.student_id ?? s.roll_no ?? `${s.name}-${s.class}`);

//   // Load attendance + students for selected date
//   useEffect(() => {
//     if (date) {
//       axios
//         .get(`http://localhost:5000/api/attendance?date=${date}`)
//         .then((res) => {
//           setStudents(res.data);
//           const att = {};
//           res.data.forEach((s) => {
//             const key = getIdKey(s);
//             att[key] = s.status === "Present";
//           });
//           setAttendance(att);
//         })
//         .catch((err) => console.error("Error loading data:", err));
//     }
//   }, [date]);

//   const toggleAttendance = (idKey) => {
//     setAttendance((prev) => ({ ...prev, [idKey]: !prev[idKey] }));
//   };

//   const saveAttendance = async () => {
//     for (let [idKey, present] of Object.entries(attendance)) {
//       const status = present ? "Present" : "Absent";
//       const student_id = isNaN(Number(idKey)) ? idKey : Number(idKey);
//       await axios.post("http://localhost:5000/api/attendance", {
//         student_id,
//         date,
//         status,
//       });
//     }
//     alert("✅ Attendance saved!");
//   };

//   const deleteAttendance = async () => {
//     if (!window.confirm(`Delete all attendance for ${date}?`)) return;
//     await axios.delete(`http://localhost:5000/api/attendance?date=${date}`);
//     alert("🗑️ Attendance deleted!");
//     setAttendance({});
//     const res = await axios.get(`http://localhost:5000/api/attendance?date=${date}`);
//     setStudents(res.data);
//   };

//   // Sorting
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

//     // Numeric compare
//     const aNum = parseFloat(a);
//     const bNum = parseFloat(b);
//     if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum;

//     return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
//   };

//   const displayed = useMemo(() => {
//     const arr = [...students];
//     if (!sortBy) return arr;
//     arr.sort((x, y) => {
//       const cmp = compareValues(x[sortBy], y[sortBy]);
//       return sortDir === "asc" ? cmp : -cmp;
//     });
//     return arr;
//   }, [students, sortBy, sortDir]);

//   const header = (label, key) => (
//     <th
//       onClick={() => handleSort(key)}
//       style={{
//         cursor: "pointer",
//         userSelect: "none",
//         background: sortBy === key ? "#d0f0ff" : "#f2f2f2",
//         padding: "6px",
//       }}
//     >
//       {label} {sortBy === key ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
//     </th>
//   );

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>📋 Take / Edit Attendance</h2>

//       <div style={{ marginBottom: "10px" }}>
//         <label><b>Date:</b></label>{" "}
//         <input
//           type="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//           style={{ marginLeft: "10px" }}
//         />
//       </div>

//       <table border="1" cellPadding="6" style={{ width: "100%", borderCollapse: "collapse" }}>
//         <thead>
//           <tr>
//             {header("Roll No", "roll_no")}
//             {header("Name", "name")}
//             {header("Class", "class")}
//             <th style={{ padding: "6px" }}>Present?</th>
//           </tr>
//         </thead>
//         <tbody>
//           {displayed.map((s) => {
//             const key = getIdKey(s);
//             return (
//               <tr key={key}>
//                 <td>{s.roll_no}</td>
//                 <td>{s.name}</td>
//                 <td>{s.class}</td>
//                 <td style={{ textAlign: "center" }}>
//                   <input
//                     type="checkbox"
//                     checked={!!attendance[key]}
//                     onChange={() => toggleAttendance(key)}
//                   />
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>

//       <div style={{ marginTop: "15px" }}>
//         <button onClick={saveAttendance} style={{ marginRight: "10px" }}>
//           💾 Save Attendance
//         </button>
//         <button onClick={deleteAttendance} style={{ background: "red", color: "white" }}>
//           🗑️ Delete Attendance
//         </button>
//       </div>
//     </div>
//   );
// }

// ...existing code...
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "../styles/TakeAttendance.css";

export default function TakeAttendance() {
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState({});
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const getIdKey = (s) => String(s.id ?? s.student_id ?? s.roll_no ?? `${s.name}-${s.class}`);

  // Load attendance + students for selected date
  useEffect(() => {
    if (date) {
      axios
        .get(`http://localhost:5000/api/attendance?date=${date}`)
        .then((res) => {
          setStudents(res.data);
          const att = {};
          res.data.forEach((s) => {
            const key = getIdKey(s);
            att[key] = s.status === "Present";
          });
          setAttendance(att);
        })
        .catch((err) => console.error("Error loading data:", err));
    }
  }, [date]);

  const toggleAttendance = (idKey) => {
    setAttendance((prev) => ({ ...prev, [idKey]: !prev[idKey] }));
  };

  const saveAttendance = async () => {
    for (let [idKey, present] of Object.entries(attendance)) {
      const status = present ? "Present" : "Absent";
      const student_id = isNaN(Number(idKey)) ? idKey : Number(idKey);
      await axios.post("http://localhost:5000/api/attendance", {
        student_id,
        date,
        status,
      });
    }
    alert("✅ Attendance saved!");
  };

  const deleteAttendance = async () => {
    if (!window.confirm(`Delete all attendance for ${date}?`)) return;
    await axios.delete(`http://localhost:5000/api/attendance?date=${date}`);
    alert("🗑️ Attendance deleted!");
    setAttendance({});
    const res = await axios.get(`http://localhost:5000/api/attendance?date=${date}`);
    setStudents(res.data);
  };

  // Sorting
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

    // Numeric compare
    const aNum = parseFloat(a);
    const bNum = parseFloat(b);
    if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum;

    return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
  };

  const displayed = useMemo(() => {
    const arr = [...students];
    if (!sortBy) return arr;
    arr.sort((x, y) => {
      const cmp = compareValues(x[sortBy], y[sortBy]);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [students, sortBy, sortDir]);

  const header = (label, key) => (
    <th
      className={`table-head-cell sortable ${sortBy === key ? "active" : ""}`}
      onClick={() => handleSort(key)}
      role="button"
    >
      <span className="col-label">{label}</span>
      <span className="sort-indicator">{sortBy === key ? (sortDir === "asc" ? "▲" : "▼") : "↕"}</span>
    </th>
  );

  return (
    <div className="take-attendance">
      {/* <h2 className="title">📋 Take / Edit Attendance</h2> */}

      <div className="controls">
        <label className="controls-label"><b>Date:</b></label>
        <input
          className="date-input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="table-wrap">
        <table className="attendance-table" aria-label="Attendance table">
          <thead className="table-header">
            <tr>
              {header("Roll No", "roll_no")}
              {header("Name", "name")}
              {header("Class", "class")}
              <th className="table-head-cell">Present?</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((s) => {
              const key = getIdKey(s);
              return (
                <tr className="table-row" key={key}>
                  <td className="table-cell">{s.roll_no}</td>
                  <td className="table-cell">{s.name}</td>
                  <td className="table-cell">{s.class}</td>
                  <td className="table-cell" style={{ textAlign: "center" }}>
                    <input
                      className="present-checkbox"
                      type="checkbox"
                      checked={!!attendance[key]}
                      onChange={() => toggleAttendance(key)}
                      aria-label={`present-${key}`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="actions-row">
        <button className="btn" onClick={saveAttendance}>💾 Save Attendance</button>
        <button className="btn btn-danger" onClick={deleteAttendance}>🗑️ Delete Attendance</button>
      </div>
    </div>
  );
}
// ...existing code...