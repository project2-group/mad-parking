const axios = require("axios");
const moment = require("moment");

class ParkingApi {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  getParkings() {
    return axios.get(`${this.baseURL}?language=es`);
  }
  getDetails(id) {
    let date = moment().format().slice(0, -6)
    return axios.get(
      `${this.baseURL}?id=${id}&family=001&date=${date}&language=ES&publicData=true`
    );
  }
}
module.exports = ParkingApi;
