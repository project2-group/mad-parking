const axios = require('axios')
class ParkingApi {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  getParkings() {
    return axios.get(`${this.baseURL}?language=es`);
  }
}
module.exports = ParkingApi