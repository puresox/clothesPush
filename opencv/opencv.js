const cv = require('opencv4nodejs');
const getPalette = require('./octree');

module.exports = function getClothePalette(clotheUrl) {
  // 读取图像
  const mat = cv.imread(`public/img/clothes/${clotheUrl}`);
  // 将图像转为灰度格式
  const matGray = mat.bgrToGray();
  // 高斯模糊滤镜消除图像上的噪点
  const matGaussianBlur = matGray.gaussianBlur(new cv.Size(5, 5), 1.2);
  // 计算阈值
  const sigma = 0.33;
  const { w: v } = matGaussianBlur.mean();
  const highThresh = Math.min(255, (1 + sigma) * v);
  const lowThresh = Math.max(0, (1 - sigma) * v);
  // 使用坎尼边缘侦测算法
  const matCanny = matGaussianBlur.canny(lowThresh, highThresh);
  // 膨胀
  const kernel = new cv.Mat(5, 5, cv.CV_8UC1, 0);
  const matDilate = matCanny.dilate(kernel);
  // 选出最大的轮廓
  const contours = matDilate.findContours(cv.RETR_LIST, cv.CHAIN_APPROX_NONE);
  let largestArea = 0;
  let largestAreaIndex;
  for (let i = 0; i < contours.length; i += 1) {
    if (contours[i].area > largestArea && contours[i].area < mat.rows * mat.cols * 0.9) {
      largestArea = contours[i].area;
      largestAreaIndex = i;
    }
  }
  // 创建一张黑色的图片
  const blackMat = new cv.Mat(mat.rows, mat.cols, cv.CV_8UC1, 0);
  // 在黑色图上用白色填充轮廓,将边框涂黑
  const WHITE = new cv.Vec(255, 255, 255);
  blackMat.drawContours(contours, WHITE, largestAreaIndex, 0, new cv.Point2(0, 0), cv.LINE_8, -1);
  const BLACK = new cv.Vec(0, 0, 0);
  blackMat.drawContours(contours, BLACK, largestAreaIndex, 0, new cv.Point2(0, 0), cv.LINE_8, 5);
  // 提取所有不是黑色的点的坐标
  const points = blackMat.findNonZero();
  // bgr转cielab色彩空间
  const labMat = mat.cvtColor(cv.COLOR_BGR2Lab);
  // 将所有的点的颜色添加到八叉树中进行颜色量化
  const colors = [];
  points.forEach(({ x, y }) => {
    // x是col，y是row
    const color = labMat.at(y, x);
    colors.push({ x: Math.round((color.x * 100) / 255), y: color.y, z: color.z });
  });

  // 色板大小
  const maxColors = 32;
  // lab空间的色板
  const labPalette = getPalette(colors, maxColors);

  // 用于存放色板的mat
  const paletteMat = new cv.Mat(labPalette.length || 1, 1, cv.CV_8UC3, [0, 0, 0]);
  labPalette.forEach((color, index) => {
    paletteMat.set(index, 0, [Math.round((color.x * 255) / 100), color.y, color.z]);
  });
  // 转为rgb
  const rgbMat = paletteMat.cvtColor(cv.COLOR_Lab2RGB);
  const rgbPalette = [];
  for (let index = 0; index < labPalette.length; index += 1) {
    const color = rgbMat.at(index, 0);
    rgbPalette.push({
      x: color.x,
      y: color.y,
      z: color.z,
      rate: labPalette[index].rate,
    });
  }

  // 创建一张透明的图片
  const alphaMat = new cv.Mat(mat.rows, mat.cols, cv.CV_8UC4, [255, 255, 255, 0]);
  points.forEach(({ x, y }) => {
    // x是col，y是row
    const color = mat.at(y, x);
    alphaMat.set(y, x, [color.x, color.y, color.z, 255]);
  });
  cv.imwrite(`public/img/clothes/${clotheUrl}`, alphaMat);

  return { labPalette, rgbPalette };
};
