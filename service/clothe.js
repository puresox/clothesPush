const { Clothe } = require('../lib/mongo.js');

module.exports = {
  create: async (userId, imagePath, style, fl, fashion, color, size) => {
    const result = await Clothe.create({
      userId,
      imagePath,
      style,
      fl,
      fashion,
      color,
      size,
    });
    return result;
  },
  findById: async (id) => {
    const result = await Clothe.findById(id);
    return result;
  },
  findByFashion: async (userId, fashion) => {
    const result = await Clothe.find({ userId, fashion });
    return result;
  },
  findByFashionFilter12: async (userId, fashion, style, flIndex) => {
    const result = await Clothe.find({
      userId,
      style,
      fashion,
    })
      .where('fl.min')
      .lte(flIndex)
      .where('fl.max')
      .gte(flIndex);
    return result;
  },
  findByIdAndDelete: async (id) => {
    const result = await Clothe.findByIdAndDelete(id);
    return result;
  },
  updateById: async (id, style, fl, fashion, size) => {
    const result = await Clothe.updateOne(
      { _id: id },
      {
        $set: {
          style,
          fl,
          fashion,
          size,
        },
      },
    );
    return result;
  },
  fl2flIndex(fl) {
    const flInt = parseInt(fl, 10);
    if (flInt < 0) {
      return '0';
    }
    if (flInt > 30) {
      return '8';
    }
    return (flInt / 5 + 1).toString(10);
  },
  normalDistribution(x, mean) {
    const score = 100 - Math.abs(x - mean);
    return score;
  },
  getColorScore(dress) {
    const colors = [];
    const dressKeys = Object.keys(dress);
    // 提取整套搭配的颜色
    dressKeys.forEach((dressKey) => {
      const { labPalette } = dress[dressKey].color;
      for (let index = 0; index < labPalette.length; index += 1) {
        const color = labPalette[index];
        if (color.rate !== '0.00') {
          let proportion = 0;
          switch (dressKey) {
            case 'coat':
              proportion = 0.35;
              break;
            case 'underwear':
              proportion = 0.15;
              break;
            case 'pants':
              proportion = 0.4;
              break;
            case 'shoes':
              proportion = 0.1;
              break;
            default:
              proportion = 0;
              break;
          }
          colors.push({
            x: color.x,
            y: color.y,
            z: color.z,
            rate: (color.rate / 100) * proportion,
          });
        } else {
          break;
        }
      }
    });
    // 计算信息熵、均值
    let informationEntropy = 0;
    let xMean = 0;
    let yMean = 0;
    let zMean = 0;
    colors.forEach((color) => {
      informationEntropy += color.rate * Math.log(1 / color.rate);
      xMean += color.rate * color.x;
      yMean += color.rate * color.y;
      zMean += color.rate * color.z;
    });
    // 计算第一项
    let variance = 0;
    colors.forEach((color) => {
      variance += (color.x - xMean) ** 2 + (color.y - yMean) ** 2 + (color.z - zMean) ** 2;
    });
    const sd = Math.sqrt(variance / colors.length);
    const colorEntropy = (sd * informationEntropy).toFixed(2);
    const colorScore = this.normalDistribution(colorEntropy, 120).toFixed(2);
    return { colorScore, colorEntropy };
  },
};
