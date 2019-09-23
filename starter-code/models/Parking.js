const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const parkingSchema = new Schema(
  {
    id_ayto: Number,
    comments: [{type : Schema.Types.ObjectId, ref: 'Comment'}],
    assessment: Number,
  },
  {
    timestamps: true
  }
);
parkingSchema.methods.getAssesment = function(comments) {
  let output = comments.reduce((ac, cu) => ac + +cu.assessment, 0) / comments.length;
  let average = +output.toFixed(1);
  return average;
};

const Parking = mongoose.model("Parking", parkingSchema);
module.exports = Parking;
