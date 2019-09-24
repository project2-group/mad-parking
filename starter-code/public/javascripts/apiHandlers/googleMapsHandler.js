class routesHandler {
  constructor() {
    // this.baseURL = baseURL;
  }

  getDefaultMap() {
    return axios.get(`${process.env.MAIL_SENDER_PASS}:${process.env.PORT}`);
  }

}