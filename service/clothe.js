const { Clothe } = require('../lib/mongo.js');

module.exports = {
  create: async (userId, imagePath, style, fl, fashion, color, size) => {
    const result = await Clothe.create({
      userId, imagePath, style, fl, fashion, color, size,
    });
    return result;
  },
  findByFashion: async (userId, fashion) => {
    const result = await Clothe.find({ userId, fashion });
    return result;
  },
  findByIdAndDelete: async (id) => {
    const result = await Clothe.findByIdAndDelete(id);
    return result;
  },
  updateById: async (id, style, fl, fashion, color, size) => {
    const result = await Clothe.updateOne({ _id: id }, {
      $set: {
        style, fl, fashion, color, size,
      },
    });
    return result;
  },
};
