module.exports = (req, res, next) => {
  // ส่งค่าข้อมูลออกเป็น Json พร้อม Status
  res.sendApi = (data, status = 200) => {
    res.setHeader("content-type", "application/json");
    res.status(status);
    res.json(data);
  };

  /**
   * ส่งค่าข้อมูลออกเป็น Json พร้อม Status
   * @param {Promise} promise
   */
  res.sendAsyncApi = promise => {
    promise
      .then(item => res.sendApi(item))
      .catch(error => res.sendApi(error, 400));
  };

  next();
};
