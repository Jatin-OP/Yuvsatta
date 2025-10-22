import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "../styles/ViewAttendance.css";

export default function StudentDetails() {
  const { roll_no } = useParams();
  const [student, setStudent] = useState(null);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM
  });
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  // fetch student by roll_no
  useEffect(() => {
    if (!roll_no) return;
    axios
      .get("http://localhost:5000/api/students", { params: { roll_no } })
      .then((res) => {
        const found = Array.isArray(res.data) ? res.data[0] : res.data;
        setStudent(found || null);
      })
      .catch((err) => {
        console.error("Failed to fetch student", err);
      });
  }, [roll_no]);

  // build all dates for selected month and fetch attendance for each day
  const loadMonthAttendance = async () => {
    if (!student && !roll_no) return;
    setLoading(true);
    try {
      const [yearStr, monStr] = month.split("-");
      const year = Number(yearStr);
      const monthIndex = Number(monStr) -1;
      const dates = [];
      const dt = new Date(year, monthIndex, 2);
      console.log(dt, monthIndex);
      console.log(dates)
      while (dt.getMonth() === monthIndex ) {
        dates.push(new Date(dt));
        dt.setDate(dt.getDate()+1 );
      }

      // fetch attendance for each date (server returns all students for date)
      console.log(dates);
      dates.push(new Date(dt));
      const promises = dates.map((d) => {
        const iso = d.toISOString().split("T")[0];
        console.log(iso);
        return axios.get("http://localhost:5000/api/attendance", { params: { date: iso } })
          .then((r) => ({ date: iso, rows: r.data }))
          .catch(() => ({ date: iso, rows: [] }));
      });

      const results = await Promise.all(promises);

      // map to our student's attendance
      const studentRoll = Number(roll_no);
   
      const mapped = results.map((r) => {

        const row = r.rows.find((x) => Number(x.roll_no) === studentRoll || String(x.student_id) === String(student?._id));
        return { date: r.date, status: row ? (row.status || "Not Marked") : "Not Marked" };
      });

      setAttendance(mapped);
    } catch (err) {
      console.error("Failed to load month attendance", err);
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMonthAttendance();
    // eslint-disable-next-line
  }, [student, month]);

  return (
    <div className="view-attendance">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="title">Student Details</h2>
        <Link to="/students" className="btn">Back to list</Link>
      </div>

      {!student ? (
        <p className="muted">Loading student...</p>
      ) : (
        <div style={{ marginBottom: 12 }}>
          <p><b>Name:</b> {student.name}</p>
          <p><b>Roll No:</b> {student.roll_no}</p>
          <p><b>Class:</b> {student.class}</p>
          <p><b>Father:</b> {student.father_name}</p>
          <p><b>Joined:</b> {student.date_of_joining}</p>
          <p><b>Contact:</b> {student.contact_no}</p>
          <p><b>Address:</b> {student.address}</p>
        </div>
      )}

      <div className="controls" style={{ marginBottom: 12 }}>
        <label className="controls-label"><b>Month:</b></label>
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="date-input" />
        <button className="btn" onClick={loadMonthAttendance} disabled={loading} style={{ marginLeft: 8 }}>
          {loading ? "Loading..." : "Load"}
        </button>
      </div>

      <div className="table-wrap">
        <table className="attendance-table">
          <thead className="table-header">
            <tr>
              <th className="table-head-cell">Date</th>
              <th className="table-head-cell">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((a) => (
              <tr key={a.date}>
                <td className="table-cell">{a.date}</td>
                <td className="table-cell">
                  <span className={`status-pill ${a.status === "Present" ? "present" : a.status === "Absent" ? "absent" : "not-marked"}`}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
            {attendance.length === 0 && (
              <tr><td className="table-cell" colSpan={2}>No data for this month.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}