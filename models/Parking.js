const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const parkingSchema = new Schema(
  {
    id_ayto: Number,
    nickName: String,
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    assessment: Number,
    location: { type: { type: String }, coordinates: [Number] },
    address: {
      address: String,
      areaCode: String,
      town: String
    },
    accesses: [
      {
        address: String,
        location: { type: { type: String }, coordinates: [Number] }
      }
    ],
    rates: [
      {
        description: String,
        rate: Number,
        minutesStayInitation: Number,
        minutesStayEnd: Number
      }
    ],
    parkingType: [
      {
        name: String,
        content: String
      }
    ],
    accessType: [
      {
        name: String,
        content: String
      }
    ],
    paymentType: [
      {
        name: String,
        content: String
      }
    ],
    additionalServices: [
      {
        name: String,
        content: String
      }
    ],
    information: [
      {
        name: String,
        content: String
      }
    ]
  },
  {
    timestamps: true
  }
);
parkingSchema.methods.getAssesment = function(comments) {
  let output =
    comments.reduce((ac, cu) => ac + +cu.assessment, 0) / comments.length;
  let average = +output.toFixed(1);
  return average;
};

const Parking = mongoose.model("Parking", parkingSchema);
module.exports = Parking;
