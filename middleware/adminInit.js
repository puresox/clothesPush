const adminModel = require('../service/admin');
const { adminInit } = require('../config/config');


module.exports = async () => {
  const admins = await adminModel.find();
  if (admins.length === 0) {
    await adminModel.create(
      adminInit.nickname,
      adminInit.pw,
      [0, 1, 2],
    );
  }
};
