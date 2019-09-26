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
        total: { type: Number, default: undefined },
        pmr: { type: Boolean, default: false },
        electric: { type: Boolean, default: false },
        motorbike: { type: Boolean, default: false },
        bike: { type: Boolean, default: false }
      }
    ],
    paymentType: {
      cash: { type: Boolean, default: false },
      card: { type: Boolean, default: false },
      mobile: { type: Boolean, default: false }
    },
    additionalServices: {
      bathroom: { type: Boolean, default: false },
      adaptedBathroom: { type: Boolean, default: false },
      elevator: { type: Boolean, default: false },
      automatedPayment: { type: Boolean, default: false },
      cashier: { type: Boolean, default: false },
      camera: { type: Boolean, default: false },
      info: { type: Boolean, default: false },
      carWash: { type: Boolean, default: false }
    },
    maxHeight: String,
    availableParking: { type: Boolean, default: false },
    availableSpots: { type: Number, default: null }
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
