const { User } = require('../lib/mongo.js');

module.exports = {
  create: async (openid, sessionId) => {
    const result = await User.create({ openid, sessionId });
    return result;
  },
  findByOpenid: async (openid) => {
    const result = await User.findOne({ openid });
    return result;
  },
  findBySessionId: async (sessionId) => {
    const result = await User.findOne({ sessionId });
    return result;
  },
  updateById: async (id, avatarUrl, nickName) => {
    const result = await User.updateOne({ _id: id }, { $set: { avatarUrl, nickName } });
    return result;
  },
};
