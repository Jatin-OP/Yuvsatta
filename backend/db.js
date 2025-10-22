// // backend/db.js
// const sqlite3 = require("sqlite3").verbose();

// const db = new sqlite3.Database("./attendance.db", (err) => {
//   if (err) console.error("❌ Database connection error:", err);
//   else console.log("✅ Connected to SQLite database");
// });

// // Students Table
// db.run(`
//   CREATE TABLE IF NOT EXISTS students (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT,
//     class TEXT,
//     roll_no INTEGER UNIQUE,      -- 🟢 roll_no must be unique
//     father_name TEXT,
//     date_of_joining TEXT,
//     contact_no TEXT,
//     address TEXT
//   )
// `);

// // Attendance Table
// db.run(`
//   CREATE TABLE IF NOT EXISTS attendance (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     student_id INTEGER,
//     date TEXT,
//     status TEXT,
//     UNIQUE(student_id, date), -- 🟢 one record per student per date
//     FOREIGN KEY(student_id) REFERENCES students(id)
//   )
// `);

// module.exports = db;



// db.js
const mongoose = require("mongoose");
require("dotenv").config();

const uri =
  "mongodb+srv://jatin1112003_db_user:1112003@cluster0.26lds7j.mongodb.net/attendance?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (err) => console.error("❌ MongoDB connection error:", err));
db.once("open", () => console.log("✅ Connected to MongoDB"));

module.exports = mongoose;
