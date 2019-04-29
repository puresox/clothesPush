const { Admin } = require('../lib/mongo.js');

module.exports = {
  create: async (nickname, pw, authority) => {
    const result = await Admin.create({ nickname, pw, authority });
    return result;
  },
  find: async () => {
    const result = await Admin.find();
    return result;
  },
  findByNickname: async (nickname) => {
    const result = await Admin.findOne({ nickname });
    return result;
  },
  findById: async (id) => {
    const result = await Admin.findById(id);
    delete result.pw;
    return result;
  },
  updateInfoById: async (id, info) => {
    const result = await Admin.updateOne({ _id: id }, { $set: info });
    return result;
  },
  updateImgById: async (id, img) => {
    const result = await Admin.updateOne({ _id: id }, { $set: { img } });
    return result;
  },
};
