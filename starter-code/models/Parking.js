const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const parkingSchema = new Schema(
  {
    id_ayto: Number,
    comments: [{}]
  },
  {
    timestamps: true
  }
);

const Parking = mongoose.model("Parking", parkingSchema);
module.exports = Parking;
