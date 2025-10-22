// // backend/server.js
// const express = require("express");
// const cors = require("cors");
// const db = require("./db");

// const app = express();

// // ✅ Middleware
// app.use(cors());
// app.use(express.json());

// // ✅ Test route
// app.get("/", (req, res) => {
//   res.send("Backend is running...");
// });

// /* ========================
//    STUDENT ROUTES
// ======================== */
// app.post("/api/students", (req, res) => {
//   const { name, class: studentClass, roll_no, father_name, date_of_joining, contact_no, address } = req.body;
//   if (!roll_no || !name) return res.status(400).json({ message: "roll_no and name are required" });

//   // ensure students table has UNIQUE(roll_no); if not, this will still work by checking existence
//   db.get("SELECT id FROM students WHERE roll_no = ?", [roll_no], (err, row) => {
//     if (err) {
//       console.error("DB select error:", err);
//       return res.status(500).json({ message: "DB error" });
//     }
//     if (row) {
//       db.run(
//         `UPDATE students SET name = ?, class = ?, father_name = ?, date_of_joining = ?, contact_no = ?, address = ? WHERE roll_no = ?`,
//         [name, studentClass, father_name, date_of_joining, contact_no, address, roll_no],
//         function (uErr) {
//           if (uErr) {
//             console.error("DB update error:", uErr);
//             return res.status(500).json({ message: "Failed to update student" });
//           }
//           return res.json({ message: "Updated", roll_no });
//         }
//       );
//     } else {
//       db.run(
//         `INSERT INTO students (name, class, roll_no, father_name, date_of_joining, contact_no, address)
//          VALUES (?, ?, ?, ?, ?, ?, ?)`,
//         [name, studentClass, roll_no, father_name, date_of_joining, contact_no, address],
//         function (iErr) {
//           if (iErr) {
//             console.error("DB insert error:", iErr);
//             return res.status(500).json({ message: "Failed to insert student" });
//           }
//           return res.json({ message: "Inserted", roll_no });
//         }
//       );
//     }
//   });
// });
// // ➕ Add or update student (unique roll_no)
// app.post("/api/students", (req, res) => {
//   const {
//     name,
//     class: studentClass,
//     roll_no,
//     father_name,
//     date_of_joining,
//     contact_no,
//     address,
//   } = req.body;

//   if (!name || !roll_no) {
//     return res.status(400).json({ message: "Name and Roll No are required" });
//   }

//   const query = `
//     INSERT INTO students (name, class, roll_no, father_name, date_of_joining, contact_no, address)
//     VALUES (?, ?, ?, ?, ?, ?, ?)
//     ON CONFLICT(roll_no)
//     DO UPDATE SET
//       name = excluded.name,
//       class = excluded.class,
//       father_name = excluded.father_name,
//       date_of_joining = excluded.date_of_joining,
//       contact_no = excluded.contact_no,
//       address = excluded.address
//   `;

//   db.run(
//     query,
//     [name, studentClass, roll_no, father_name, date_of_joining, contact_no, address],
//     function (err) {
//       if (err) {
//         console.error("Error inserting student:", err);
//         res.status(500).send(err.message);
//       } else {
//         res.status(201).json({ message: "✅ Student added/updated successfully" });
//       }
//     }
//   );
// });

// // 📋 Get all students
// app.get("/api/students", (req, res) => {
//   db.all("SELECT * FROM students ORDER BY class, roll_no", [], (err, rows) => {
//     if (err) {
//       console.error("Error fetching students:", err);
//       res.status(500).send(err.message);
//     } else {
//       res.json(rows);
//     }
//   });
// });

// /* ========================
//    ATTENDANCE ROUTES
// ======================== */

// // ✅ Add or update attendance
// app.post("/api/attendance", (req, res) => {
//   const { student_id, date, status } = req.body;

//   if (!student_id || !date) {
//     return res.status(400).json({ message: "Student ID and date required" });
//   }

//   const query = `
//     INSERT INTO attendance (student_id, date, status)
//     VALUES (?, ?, ?)
//     ON CONFLICT(student_id, date)
//     DO UPDATE SET status = excluded.status
//   `;

//   db.run(query, [student_id, date, status], function (err) {
//     if (err) {
//       console.error("Error saving attendance:", err);
//       res.status(500).send(err.message);
//     } else {
//       res.status(201).json({ message: "✅ Attendance recorded/updated successfully" });
//     }
//   });
// });

// // 📆 Get attendance for a specific date
// app.get("/api/attendance", (req, res) => {
//   const { date } = req.query;

//   if (!date) {
//     return res.status(400).json({ message: "Date is required" });
//   }

//   const query = `
//     SELECT s.id AS student_id, s.name, s.class, s.roll_no,
//            COALESCE(a.status, '') AS status
//     FROM students s
//     LEFT JOIN attendance a ON s.id = a.student_id AND a.date = ?
//     ORDER BY s.class, s.roll_no
//   `;

//   db.all(query, [date], (err, rows) => {
//     if (err) {
//       console.error("Error fetching attendance:", err);
//       res.status(500).send(err.message);
//     } else {
//       res.json(rows);
//     }
//   });
// });

// // 🗑️ Delete attendance for a date
// app.delete("/api/attendance", (req, res) => {
//   const { date } = req.query;

//   if (!date) {
//     return res.status(400).json({ message: "Missing date parameter" });
//   }

//   db.run(`DELETE FROM attendance WHERE date = ?`, [date], function (err) {
//     if (err) {
//       console.error("Error deleting attendance:", err);
//       res.status(500).send(err.message);
//     } else {
//       res.json({ message: `🗑️ Deleted ${this.changes} attendance records for ${date}` });
//     }
//   });
// });

// /* ========================
//    START SERVER
// ======================== */
// // ...existing code...
// // ➖ Delete student by roll_no (removes related attendance) - transactional + verbose logging
// app.get("/api/students", (req, res) => {
//   const { name, roll_no, class: studentClass } = req.query;

//   let sql = "SELECT * FROM students";
//   const clauses = [];
//   const params = [];

//   if (name) {
//     // case-insensitive partial match
//     clauses.push("LOWER(name) LIKE ?");
//     params.push(`%${String(name).toLowerCase()}%`);
//   }
//   if (roll_no) {
//     // exact match for roll_no
//     clauses.push("roll_no = ?");
//     params.push(String(roll_no));
//   }
//   if (studentClass) {
//     clauses.push("class = ?");
//     params.push(String(studentClass));
//   }

//   if (clauses.length) {
//     sql += " WHERE " + clauses.join(" AND ");
//   }

//   sql += " ORDER BY class, roll_no";

//   console.log("GET /api/students ->", sql, params);
//   db.all(sql, params, (err, rows) => {
//     if (err) {
//       console.error("DB error fetching students:", err);
//       return res.status(500).json({ message: "Database error" });
//     }
//     return res.json(rows);
//   });
// });
// // ...existing code...
// app.delete("/api/students", (req, res) => {
//   const { roll_no } = req.query;
//   console.log("DELETE /api/students called with query:", req.query);
//   if (!roll_no) {
//     return res.status(400).json({ ok: false, message: "roll_no query parameter is required" });
//   }

//   db.get("SELECT id FROM students WHERE roll_no = ?", [roll_no], (err, row) => {
//     if (err) {
//       console.error("DB select error:", err);
//       return res.status(500).json({ ok: false, message: "Database error" });
//     }
//     if (!row) {
//       console.warn("Student not found for roll_no:", roll_no);
//       return res.status(404).json({ ok: false, message: "Student not found" });
//     }

//     const studentId = row.id;
//     db.run("DELETE FROM attendance WHERE student_id = ?", [studentId], function (err) {
//       if (err) {
//         console.error("Error deleting attendance:", err);
//         return res.status(500).json({ ok: false, message: "Failed deleting attendance" });
//       }
//       console.log(`Deleted ${this.changes} attendance rows for student_id=${studentId}`);
//       db.run("DELETE FROM students WHERE id = ?", [studentId], function (err) {
//         if (err) {
//           console.error("Error deleting student:", err);
//           return res.status(500).json({ ok: false, message: "Failed deleting student" });
//         }
//         console.log(`Deleted student id=${studentId}`);
//         return res.json({ ok: true, message: "Deleted student and related attendance" });
//       });
//     });
//   });
// });

// const PORT = 5000;
// app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// ✅ MongoDB Atlas connection
const uri = "mongodb+srv://jatin1112003_db_user:1112003@cluster0.26lds7j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ===========================
   Define Mongoose Schemas
=========================== */
const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    class: { type: String, default: "" },
    roll_no: { type: Number, unique: true, sparse: true },
    father_name: { type: String, default: "" },
    date_of_joining: { type: String, default: "" },
    contact_no: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { timestamps: true }
);

const AttendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    date: { type: String, required: true },
    status: { type: String, default: "" },
  },
  { timestamps: true }
);

AttendanceSchema.index({ student: 1, date: 1 }, { unique: true });

const Student = mongoose.model("Student", StudentSchema);
const Attendance = mongoose.model("Attendance", AttendanceSchema);

/* ===========================
   Initialize Express App
=========================== */
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("✅ Backend is running with MongoDB Atlas"));

/* ===========================
   STUDENT ROUTES
=========================== */

// ➕ Add or Update Student (unique roll_no)
app.post("/api/students", async (req, res) => {
  try {
    const { name, class: studentClass, roll_no, father_name, date_of_joining, contact_no, address } = req.body;

    if (!name || roll_no == null) {
      return res.status(400).json({ message: "Name and Roll No are required" });
    }

    const filter = { roll_no };
    const update = {
      name,
      class: studentClass || "",
      father_name: father_name || "",
      date_of_joining: date_of_joining || "",
      contact_no: contact_no || "",
      address: address || "",
    };

    const opts = { upsert: true, new: true, setDefaultsOnInsert: true };
    const student = await Student.findOneAndUpdate(filter, update, opts);

    res.status(201).json({ message: "✅ Student added/updated successfully", student });
  } catch (err) {
    console.error("POST /api/students error:", err);
    res.status(500).json({ message: err.message });
  }
});

// 📋 Get all students (with optional filters)
app.get("/api/students", async (req, res) => {
  try {
    const { name, roll_no, class: studentClass } = req.query;

    const filter = {};
    if (name) filter.name = { $regex: name, $options: "i" };
    if (roll_no) filter.roll_no = Number(roll_no);
    if (studentClass) filter.class = studentClass;

    const students = await Student.find(filter).sort({ class: 1, roll_no: 1 });
    res.json(students);
  } catch (err) {
    console.error("GET /api/students error:", err);
    res.status(500).json({ message: err.message });
  }
});

// 🗑️ Delete student by roll_no (and remove related attendance)
app.delete("/api/students", async (req, res) => {
  try {
    const { roll_no } = req.query;
    if (!roll_no) {
      return res.status(400).json({ ok: false, message: "roll_no query parameter is required" });
    }

    const student = await Student.findOne({ roll_no: Number(roll_no) });
    if (!student) {
      return res.status(404).json({ ok: false, message: "Student not found" });
    }

    await Attendance.deleteMany({ student: student._id });
    await Student.deleteOne({ _id: student._id });

    res.json({ ok: true, message: "🗑️ Deleted student and related attendance" });
  } catch (err) {
    console.error("DELETE /api/students error:", err);
    res.status(500).json({ ok: false, message: err.message });
  }
});

/* ===========================
   ATTENDANCE ROUTES
=========================== */

// ✅ Add or Update Attendance
app.post("/api/attendance", async (req, res) => {
  try {
    const { student_id, date, status } = req.body;

    if (!student_id || !date) {
      return res.status(400).json({ message: "Student ID and date required" });
    }

    // Resolve student (can be roll_no or _id)
    let studentDoc = null;
    if (mongoose.Types.ObjectId.isValid(student_id)) {
      studentDoc = await Student.findById(student_id);
    }
    if (!studentDoc) {
      const maybeRoll = Number(student_id);
      if (!Number.isNaN(maybeRoll)) studentDoc = await Student.findOne({ roll_no: maybeRoll });
    }
    if (!studentDoc) return res.status(404).json({ message: "Student not found" });

    const filter = { student: studentDoc._id, date };
    const update = { status: status || "" };
    const opts = { upsert: true, new: true, setDefaultsOnInsert: true };

    const att = await Attendance.findOneAndUpdate(filter, update, opts);
    res.status(201).json({ message: "✅ Attendance recorded/updated successfully", attendance: att });
  } catch (err) {
    console.error("POST /api/attendance error:", err);
    res.status(500).json({ message: err.message });
  }
});

// 📆 Get attendance for specific date
app.get("/api/attendance", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Date is required" });

    const rows = await Student.aggregate([
      {
        $lookup: {
          from: "attendances",
          let: { studentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$student", "$$studentId"] }, { $eq: ["$date", date] }],
                },
              },
            },
            { $project: { status: 1, _id: 0 } },
          ],
          as: "att",
        },
      },
      {
        $addFields: {
          status: { $ifNull: [{ $arrayElemAt: ["$att.status", 0] }, ""] },
        },
      },
      { $sort: { class: 1, roll_no: 1 } },
      {
        $project: {
          att: 0,
        },
      },
    ]);

    const mapped = rows.map((r) => ({
      student_id: r._id,
      name: r.name,
      class: r.class,
      roll_no: r.roll_no,
      status: r.status || "",
    }));

    res.json(mapped);
  } catch (err) {
    console.error("GET /api/attendance error:", err);
    res.status(500).json({ message: err.message });
  }
});

// 🗑️ Delete attendance for a specific date
app.delete("/api/attendance", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Missing date parameter" });

    const del = await Attendance.deleteMany({ date });
    res.json({ message: `🗑️ Deleted ${del.deletedCount} attendance records for ${date}` });
  } catch (err) {
    console.error("DELETE /api/attendance error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ===========================
   START SERVER
=========================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
