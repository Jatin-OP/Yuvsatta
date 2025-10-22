// // import React, { useState, useEffect } from "react";
// // import { getAttendance } from "../api";
// // import axios from "axios";


// // const ViewAttendance = () => {
// //   const [date, setDate] = useState("");
// //   const [attendance, setAttendance] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null); // State for error handling

// //   // new: per-row editing state
// //   const [editingStudentId, setEditingStudentId] = useState(null);
// //   const [editingStatus, setEditingStatus] = useState("");
// //   const [savingStudentId, setSavingStudentId] = useState(null);

// //   // Fetch attendance when date changes
// //   useEffect(() => {
// //     if (!date) return;

// //     setLoading(true);
// //     setError(null); // Reset error state before fetching

// //     getAttendance(date)
// //       .then((res) => {
// //         setAttendance(res.data);
// //       })
// //       .catch((err) => {
// //         console.error("Error fetching attendance:", err);
// //         setError("Failed to fetch attendance. Please try again."); // Set error message
// //       })
// //       .finally(() => setLoading(false));
// //   }, [date]);

// //   const startEdit = (row) => {
// //     setEditingStudentId(row.student_id);
// //     setEditingStatus(row.status || "Not Marked");
// //   };

// //   const cancelEdit = () => {
// //     setEditingStudentId(null);
// //     setEditingStatus("");
// //   };

// //   const saveEdit = async (row) => {
// //     if (!date) {
// //       setError("Please select a date before saving.");
// //       return;
// //     }

// //     const statusToSend = editingStatus === "Not Marked" ? "" : editingStatus;

// //     try {
// //       setSavingStudentId(row.student_id);
// //       setError(null);
// //       await axios.post("http://localhost:5000/api/attendance", {
// //         student_id: row.student_id,
// //         date,
// //         status: statusToSend,
// //       });

// //       // update local state to reflect saved status
// //       setAttendance((prev) =>
// //         prev.map((r) =>
// //           r.student_id === row.student_id ? { ...r, status: editingStatus === "Not Marked" ? "" : editingStatus } : r
// //         )
// //       );
// //       setEditingStudentId(null);
// //       setEditingStatus("");
// //     } catch (err) {
// //       console.error("Error saving attendance:", err);
// //       setError("Failed to save attendance. Try again.");
// //     } finally {
// //       setSavingStudentId(null);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
// //       <h2 className="text-2xl font-bold mb-4">📅 View Attendance</h2>

// //       <div className="mb-6">
// //         <label className="font-semibold mr-2">Select Date:</label>
// //         <input
// //           type="date"
// //           value={date}
// //           onChange={(e) => setDate(e.target.value)}
// //           className="border rounded p-2"
// //         />
// //       </div>

// //       {loading && <p className="text-gray-600">Loading attendance...</p>}

// //       {error && <p className="text-red-600">{error}</p>} {/* Display error message */}

// //       {!loading && date && attendance.length > 0 ? (
// //         <table className="border-collapse border border-gray-400 w-3/4 text-center">
// //           <thead className="bg-gray-200">
// //             <tr>
// //               <th className="border border-gray-400 px-3 py-2">Roll No</th>
// //               <th className="border border-gray-400 px-3 py-2">Name</th>
// //               <th className="border border-gray-400 px-3 py-2">Class</th>
// //               <th className="border border-gray-400 px-3 py-2">Status</th>
// //               <th className="border border-gray-400 px-3 py-2">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {attendance.map((s) => (
// //               <tr key={s.student_id ?? s.roll_no} className="hover:bg-gray-100">
// //                 <td className="border border-gray-300 px-3 py-2">{s.roll_no}</td>
// //                 <td className="border border-gray-300 px-3 py-2">{s.name}</td>
// //                 <td className="border border-gray-300 px-3 py-2">{s.class}</td>
// //                 <td className="border border-gray-300 px-3 py-2 font-semibold">
// //                   {editingStudentId === s.student_id ? (
// //                     <select
// //                       value={editingStatus}
// //                       onChange={(e) => setEditingStatus(e.target.value)}
// //                       className="border rounded p-1"
// //                     >
// //                       <option value="Present">Present</option>
// //                       <option value="Absent">Absent</option>
// //                       <option value="Not Marked">Not Marked</option>
// //                     </select>
// //                   ) : (
// //                     <span
// //                       className={`${
// //                         s.status === "Present"
// //                           ? "text-green-600"
// //                           : s.status === "Absent"
// //                           ? "text-red-600"
// //                           : "text-gray-500"
// //                       }`}
// //                     >
// //                       {s.status || "Not Marked"}
// //                     </span>
// //                   )}
// //                 </td>
// //                 <td className="border border-gray-300 px-3 py-2">
// //                   {editingStudentId === s.student_id ? (
// //                     <>
// //                       <button
// //                         onClick={() => saveEdit(s)}
// //                         disabled={savingStudentId === s.student_id}
// //                         className="bg-blue-600 text-white px-3 py-1 rounded mr-2"
// //                       >
// //                         {savingStudentId === s.student_id ? "Saving..." : "Save"}
// //                       </button>
// //                       <button onClick={cancelEdit} className="bg-gray-300 px-3 py-1 rounded">
// //                         Cancel
// //                       </button>
// //                     </>
// //                   ) : (
// //                     <button onClick={() => startEdit(s)} className="bg-yellow-500 px-3 py-1 rounded">
// //                       Edit
// //                     </button>
// //                   )}
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       ) : !loading && date ? (
// //         <p className="text-gray-500">No attendance found for this date.</p>
// //       ) : (
// //         <p className="text-gray-500">Please select a date to view attendance.</p>
// //       )}
// //     </div>
// //   );
// // };

// // export default ViewAttendance;
// import React, { useState, useEffect, useMemo } from "react";
// import { getAttendance } from "../api";
// import axios from "axios";

// const ViewAttendance = () => {
//   const [date, setDate] = useState("");
//   const [attendance, setAttendance] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [editingStudentId, setEditingStudentId] = useState(null);
//   const [editingStatus, setEditingStatus] = useState("");
//   const [savingStudentId, setSavingStudentId] = useState(null);

//   // Sorting
//   const [sortBy, setSortBy] = useState(null);
//   const [sortDir, setSortDir] = useState("asc");

//   useEffect(() => {
//     if (!date) return;

//     setLoading(true);
//     setError(null);

//     getAttendance(date)
//       .then((res) => setAttendance(res.data))
//       .catch((err) => {
//         console.error("Error fetching attendance:", err);
//         setError("Failed to fetch attendance. Please try again.");
//       })
//       .finally(() => setLoading(false));
//   }, [date]);

//   const startEdit = (row) => {
//     setEditingStudentId(row.student_id);
//     setEditingStatus(row.status || "Not Marked");
//   };

//   const cancelEdit = () => {
//     setEditingStudentId(null);
//     setEditingStatus("");
//   };

//   const saveEdit = async (row) => {
//     if (!date) {
//       setError("Please select a date before saving.");
//       return;
//     }
//     const statusToSend = editingStatus === "Not Marked" ? "" : editingStatus;

//     try {
//       setSavingStudentId(row.student_id);
//       setError(null);
//       await axios.post("http://localhost:5000/api/attendance", {
//         student_id: row.student_id,
//         date,
//         status: statusToSend,
//       });
//       setAttendance((prev) =>
//         prev.map((r) =>
//           r.student_id === row.student_id
//             ? { ...r, status: editingStatus === "Not Marked" ? "" : editingStatus }
//             : r
//         )
//       );
//       cancelEdit();
//     } catch (err) {
//       console.error("Error saving attendance:", err);
//       setError("Failed to save attendance. Try again.");
//     } finally {
//       setSavingStudentId(null);
//     }
//   };

//   // Sorting functions
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

//     // Numeric compare for roll_no
//     const aNum = parseFloat(a);
//     const bNum = parseFloat(b);
//     if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum;

//     // String compare
//     return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
//   };

//   const displayed = useMemo(() => {
//     const arr = [...attendance];
//     if (!sortBy) return arr;
//     arr.sort((x, y) => {
//       const cmp = compareValues(x[sortBy], y[sortBy]);
//       return sortDir === "asc" ? cmp : -cmp;
//     });
//     return arr;
//   }, [attendance, sortBy, sortDir]);

//   const header = (label, key) => (
//     <th
//       onClick={() => handleSort(key)}
//       style={{
//         cursor: "pointer",
//         userSelect: "none",
//         padding: "6px",
//         background: sortBy === key ? "#d0f0ff" : "#f2f2f2",
//       }}
//     >
//       {label} {sortBy === key ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
//     </th>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
//       <h2 className="text-2xl font-bold mb-4">📅 View Attendance</h2>

//       <div className="mb-6">
//         <label className="font-semibold mr-2">Select Date:</label>
//         <input
//           type="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//           className="border rounded p-2"
//         />
//       </div>

//       {loading && <p className="text-gray-600">Loading attendance...</p>}
//       {error && <p className="text-red-600">{error}</p>}

//       {!loading && date && displayed.length > 0 ? (
//         <table className="border-collapse border border-gray-400 w-3/4 text-center">
//           <thead className="bg-gray-200">
//             <tr>
//               {header("Roll No", "roll_no")}
//               {header("Name", "name")}
//               {header("Class", "class")}
//               {header("Status", "status")}
//               <th className="border border-gray-400 px-3 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {displayed.map((s) => (
//               <tr key={s.student_id ?? s.roll_no} className="hover:bg-gray-100">
//                 <td className="border border-gray-300 px-3 py-2">{s.roll_no}</td>
//                 <td className="border border-gray-300 px-3 py-2">{s.name}</td>
//                 <td className="border border-gray-300 px-3 py-2">{s.class}</td>
//                 <td className="border border-gray-300 px-3 py-2 font-semibold">
//                   {editingStudentId === s.student_id ? (
//                     <select
//                       value={editingStatus}
//                       onChange={(e) => setEditingStatus(e.target.value)}
//                       className="border rounded p-1"
//                     >
//                       <option value="Present">Present</option>
//                       <option value="Absent">Absent</option>
//                       <option value="Not Marked">Not Marked</option>
//                     </select>
//                   ) : (
//                     <span
//                       className={`${
//                         s.status === "Present"
//                           ? "text-green-600"
//                           : s.status === "Absent"
//                           ? "text-red-600"
//                           : "text-gray-500"
//                       }`}
//                     >
//                       {s.status || "Not Marked"}
//                     </span>
//                   )}
//                 </td>
//                 <td className="border border-gray-300 px-3 py-2">
//                   {editingStudentId === s.student_id ? (
//                     <>
//                       <button
//                         onClick={() => saveEdit(s)}
//                         disabled={savingStudentId === s.student_id}
//                         className="bg-blue-600 text-white px-3 py-1 rounded mr-2"
//                       >
//                         {savingStudentId === s.student_id ? "Saving..." : "Save"}
//                       </button>
//                       <button onClick={cancelEdit} className="bg-gray-300 px-3 py-1 rounded">
//                         Cancel
//                       </button>
//                     </>
//                   ) : (
//                     <button onClick={() => startEdit(s)} className="bg-yellow-500 px-3 py-1 rounded">
//                       Edit
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : !loading && date ? (
//         <p className="text-gray-500">No attendance found for this date.</p>
//       ) : (
//         <p className="text-gray-500">Please select a date to view attendance.</p>
//       )}
//     </div>
//   );
// };

// export default ViewAttendance;
// ...existing code...
import React, { useState, useEffect, useMemo } from "react";
import { getAttendance } from "../api";
import axios from "axios";
import "../styles/ViewAttendance.css";

const ViewAttendance = () => {
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editingStatus, setEditingStatus] = useState("");
  const [savingStudentId, setSavingStudentId] = useState(null);

  // Sorting
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    if (!date) return;

    setLoading(true);
    setError(null);

    getAttendance(date)
      .then((res) => setAttendance(res.data))
      .catch((err) => {
        console.error("Error fetching attendance:", err);
        setError("Failed to fetch attendance. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [date]);

  const startEdit = (row) => {
    setEditingStudentId(row.student_id);
    setEditingStatus(row.status || "Not Marked");
  };

  const cancelEdit = () => {
    setEditingStudentId(null);
    setEditingStatus("");
  };

  const saveEdit = async (row) => {
    if (!date) {
      setError("Please select a date before saving.");
      return;
    }
    const statusToSend = editingStatus === "Not Marked" ? "" : editingStatus;

    try {
      setSavingStudentId(row.student_id);
      setError(null);
      await axios.post("http://localhost:5000/api/attendance", {
        student_id: row.student_id,
        date,
        status: statusToSend,
      });
      setAttendance((prev) =>
        prev.map((r) =>
          r.student_id === row.student_id
            ? { ...r, status: editingStatus === "Not Marked" ? "" : editingStatus }
            : r
        )
      );
      cancelEdit();
    } catch (err) {
      console.error("Error saving attendance:", err);
      setError("Failed to save attendance. Try again.");
    } finally {
      setSavingStudentId(null);
    }
  };

  // Sorting functions
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

    // Numeric compare for roll_no
    const aNum = parseFloat(a);
    const bNum = parseFloat(b);
    if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum;

    // String compare
    return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
  };

  const displayed = useMemo(() => {
    const arr = [...attendance];
    if (!sortBy) return arr;
    arr.sort((x, y) => {
      const cmp = compareValues(x[sortBy], y[sortBy]);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [attendance, sortBy, sortDir]);

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
    <div className="view-attendance">
      <h2 className="title">📅 View Attendance</h2>

      <div className="controls">
        <label className="controls-label">Select Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="date-input"
        />
      </div>

      {loading && <p className="muted">Loading attendance...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && date && displayed.length > 0 ? (
        <div className="table-wrap">
          <table className="attendance-table" aria-label="Attendance table">
            <thead className="table-header">
              <tr>
                {header("Roll No", "roll_no")}
                {header("Name", "name")}
                {header("Class", "class")}
                {header("Status", "status")}
                <th className="table-head-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((s) => (
                <tr key={s.student_id ?? s.roll_no} className="table-row">
                  <td className="table-cell">{s.roll_no}</td>
                  <td className="table-cell">{s.name}</td>
                  <td className="table-cell">{s.class}</td>
                  <td className="table-cell status-cell">
                    {editingStudentId === s.student_id ? (
                      <select
                        value={editingStatus}
                        onChange={(e) => setEditingStatus(e.target.value)}
                        className="form-input small-select"
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Not Marked">Not Marked</option>
                      </select>
                    ) : (
                      <span
                        className={`status-pill ${
                          s.status === "Present" ? "present" : s.status === "Absent" ? "absent" : "not-marked"
                        }`}
                      >
                        {s.status || "Not Marked"}
                      </span>
                    )}
                  </td>
                  <td className="table-cell actions">
                    {editingStudentId === s.student_id ? (
                      <>
                        <button
                          onClick={() => saveEdit(s)}
                          disabled={savingStudentId === s.student_id}
                          className="btn"
                        >
                          {savingStudentId === s.student_id ? "Saving..." : "Save"}
                        </button>
                        <button onClick={cancelEdit} className="btn btn-secondary">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button onClick={() => startEdit(s)} className="btn btn-secondary">
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !loading && date ? (
        <p className="muted">No attendance found for this date.</p>
      ) : (
        <p className="muted">Please select a date to view attendance.</p>
      )}
    </div>
  );
};

export default ViewAttendance;
// ...existing code...