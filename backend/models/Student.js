const mongoose = require("mongoose");

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

module.exports = mongoose.models.Student || mongoose.model("Student", StudentSchema);
