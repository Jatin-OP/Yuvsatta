// const fs = require("fs");
// const path = require("path");
// const { parse } = require("csv-parse/sync"); // <- use public sync entrypoint
// const db = require("./db"); // ensure db.js does: module.exports = db

// const csvPath = process.argv[2];
// if (!csvPath) {
//   console.error("Usage: node import_students.js <path-to-csv>");
//   process.exit(1);
// }

// const abs = path.resolve(csvPath);
// if (!fs.existsSync(abs)) {
//   console.error("File not found:", abs);
//   process.exit(1);
// }

// let records;
// try {
//   const content = fs.readFileSync(abs, "utf8");
//   records = parse(content, { columns: true, skip_empty_lines: true, trim: true });
// } catch (err) {
//   console.error("Failed to read/parse CSV:", err.message || err);
//   process.exit(1);
// }

// db.serialize(() => {
//   db.run("BEGIN TRANSACTION");
//   const stmt = db.prepare(
//     `INSERT INTO students (name, class, roll_no, father_name, date_of_joining, contact_no, address)
//      VALUES (?, ?, ?, ?, ?, ?, ?)
//      ON CONFLICT(roll_no) DO UPDATE SET
//        name = excluded.name,
//        class = excluded.class,
//        father_name = excluded.father_name,
//        date_of_joining = excluded.date_of_joining,
//        contact_no = excluded.contact_no,
//        address = excluded.address`
//   );

//   let processed = 0;
//   for (const row of records) {
//     console.log(row)
//     const name = row.name ?? row.Name ?? "";
//     const studentClass = row.class ?? row.Class ?? "";
//     const roll_no = row.roll_no ?? row.RollNo ?? row.roll ?? "";
//     const father_name = row.FathersName ?? row.FatherName ?? "";
//     const date_of_joining = row.DOJ ?? row.DateOfJoining ?? "";
//     const contact_no = row.Contacts ?? row.Contact ?? "";
//     const address = row.Addresss ?? row.Address ?? "";

//     if (!roll_no || !name) {
//       console.warn("Skipping row missing roll_no or name:", row);
//       continue;
//     }

//     stmt.run(
//       [name, studentClass, String(roll_no), father_name, date_of_joining, contact_no, address],
//       (err) => {
//         if (err) console.error("Insert error for", roll_no, err.message);
//       }
//     );
//     processed++;
//   }

//   stmt.finalize((err) => {
//     if (err) console.error("Finalize error:", err);
//     db.run("COMMIT", (cErr) => {
//       if (cErr) {
//         console.error("Commit error:", cErr);
//         process.exit(1);
//       }
//       console.log(`Imported ${processed} rows (skipped invalid rows).`);
//       process.exit(0);
//     });
//   });
// });

// importStudents.js
// import_students.js
const mongoose = require("mongoose");
const csv = require("csvtojson");

const uri = "mongodb+srv://jatin1112003_db_user:1112003@cluster0.26lds7j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const StudentSchema = new mongoose.Schema({
  name: { type: String },
  class: { type: String, default: "" },
  roll_no: { type: Number, unique: true, sparse: true },
  father_name: { type: String, default: "" },
  date_of_joining: { type: String, default: "" },
  contact_no: { type: String, default: "" },
  address: { type: String, default: "" },
}, { timestamps: true });

const Student = mongoose.model("Student", StudentSchema);

const filePath = "./data/attendance_data.csv";

async function importData() {
  try {
    const jsonArray = await csv().fromFile(filePath);
    console.log(`✅ Loaded ${jsonArray.length} records from CSV`);
    
    let insertedCount = 0;
    for (const s of jsonArray) {
      const exists = await Student.findOne({ roll_no: s.roll_no });
      if (!exists) {
        await Student.create(s);
        insertedCount++;
      }
    }

    console.log(`✅ Successfully inserted ${insertedCount} new students`);
  } catch (err) {
    console.error("❌ Error importing data:", err);
  } finally {
    mongoose.connection.close();
  }
}

importData();
