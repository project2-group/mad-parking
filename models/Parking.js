const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\“]+(\.[^<>()\[\]\.,;:\s@\“]+)*)|(\“.+\“))@(([^<>()[\]\.,;:\s@\“]+\.)+[^<>()[\]\.,;:\s@\“]{2,})$/i;

const parkingSchema = new Schema(
  {
    id_ayto: Number,
    nickName: String,
    comments: [{type : Schema.Types.ObjectId, ref: 'Comment'}],
    assessment: Number,
    location: { type: { type: String }, coordinates: [Number] },
    contact: {
      address: {
        address: String,
        areaCode: String,
        town: String
      },
      phone: {type: Number},
      email: {type: String, match: [EMAIL_PATTERN, "this is not a correct email"]},
      web: {type: String}
    },
    accesses: [{
      address: String,
      location: { type: { type: String }, coordinates: [Number] }
    }],
    schedule: String,
    rates: [{
      description: String,
      rate: Number
    }],
    parkingType: [{
      name: String,
      content: String
    }],
    accessType: [{
      name: String,
      content: String
    }],
    paymentType: [{
      name: String,
      content: String
    }],
    additionalServices: [{
      name: String,
      content: String
    }],
    information: [{
      name: String,
      content: String
    }]
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
