module.exports = function getPalette(colors, maxColors) {
  // 色板
  const palette = [];
  // 叶子总数
  let leafNum = 0;
  // 颜色总数
  const colorsNum = colors.length;
  // 可归并链表
  const reducible = new Array(8);
  for (let i = 0; i < reducible.length; i += 1) reducible[i] = [];

  const Octree = class {
    constructor() {
      // 是否为叶子节点
      this.isLeaf = false;
      // 色彩频度计数
      this.pixelCount = 0;
      // 色彩三个分量
      this.x = 0;
      this.y = 0;
      this.z = 0;
      // 八个子节点指针
      this.children = new Array(8);
      for (let i = 0; i < this.children.length; i += 1) this.children[i] = null;
    }
  };

  /**
   * 通过颜色计算路径
   *
   * @param {*} color 颜色
   * @returns
   */
  function octreeBranch(color) {
    const branch = new Array(8);
    // 转为8位二进制
    const x = color.x.toString(2).padStart(8, '0');
    const y = color.y.toString(2).padStart(8, '0');
    const z = color.z.toString(2).padStart(8, '0');
    for (let index = 0; index < 8; index += 1) {
      const str = x[index] + y[index] + z[index];
      branch[index] = parseInt(str, 2);
    }
    return branch;
  }

  function createNode(depth) {
    const node = new Octree();
    if (depth === 7) {
      node.isLeaf = true;
      leafNum += 1;
    } else {
      // 将其丢到第 level 层的 reducible 链表中
      reducible[depth + 1].push(node);
    }
    return node;
  }

  /**
   * 在node的第branch[depth]个子节点中插入color
   *
   * @param {*} node 节点
   * @param {*} color 颜色
   * @param {*} depth 深度
   * @param {*} branch 路径
   */
  function insertTree(node, color, depth, branch) {
    node.pixelCount += 1;
    if (node.isLeaf) {
      node.x += color.x;
      node.y += color.y;
      node.z += color.z;
    } else {
      const idx = branch[depth];

      if (!node.children[idx]) {
        node.children[idx] = createNode(depth);
      }

      insertTree(node.children[idx], color, depth + 1, branch);
    }
  }

  /**
   * 八叉树归约
   *
   */
  function reduceTree() {
    // 找到最深层次的并且有可合并节点的链表
    let lv = 7;
    while (reducible[lv].length === 0) lv -= 1;

    // 对链表进行升序排序
    reducible[lv].sort((a, b) => a.pixelCount - b.pixelCount);

    // 取出链表头并将其从链表中移除
    const node = reducible[lv].shift();

    // 合并子节点
    for (let i = 0; i < 8; i += 1) {
      if (node.children[i] !== null) {
        node.x += node.children[i].x;
        node.y += node.children[i].y;
        node.z += node.children[i].z;
        leafNum -= 1;
      }
    }

    // 赋值
    node.isLeaf = true;
    leafNum += 1;
  }

  /**
   * 合并比重小于1%的节点
   *
   */
  function reduce() {
    // 找到最深层次的并且有可合并节点的链表
    let lv = 7;
    while (reducible[lv].length === 0) lv -= 1;

    // 对链表进行升序排序
    reducible[lv].sort((a, b) => a.pixelCount - b.pixelCount);

    // 取出链表头并将其从链表中移除
    const node = reducible[lv].shift();
    const rate = parseFloat(((node.pixelCount / colorsNum) * 100).toFixed(2));
    if (rate < 1) {
      // 合并子节点
      for (let i = 0; i < 8; i += 1) {
        if (node.children[i] !== null) {
          node.x += node.children[i].x;
          node.y += node.children[i].y;
          node.z += node.children[i].z;
          leafNum -= 1;
        }
      }

      // 赋值
      node.isLeaf = true;
      leafNum += 1;
      reduce();
    }
  }

  /**
   * 生成八叉树
   * @param {[{r: Number, g: Number, b: Number}]} colors 颜色数组
   * @param {Number} maxColors 最大颜色数
   */
  function generateOctree() {
    // 根节点
    const root = new Octree();
    reducible[0].push(root);
    colors.forEach((color) => {
      // 计算路径
      const branch = octreeBranch(color);
      // 添加颜色
      insertTree(root, color, 0, branch);
      // 合并叶子节点
      while (leafNum > maxColors) reduceTree();
    });
    return root;
  }

  function dfsOctree(node) {
    if (node.isLeaf) {
      const x = Math.round(node.x / node.pixelCount);
      const y = Math.round(node.y / node.pixelCount);
      const z = Math.round(node.z / node.pixelCount);
      const rate = ((node.pixelCount / colorsNum) * 100).toFixed(2);
      const paletteColor = {
        x, y, z, rate,
      };
      node.paletteColor = paletteColor;
      palette.push(paletteColor);
    } else {
      for (let i = 0; i < 8; i += 1) {
        if (node.children[i] !== null) {
          dfsOctree(node.children[i]);
        }
      }
    }
  }

  const root = generateOctree();
  reduce();
  dfsOctree(root);
  // 降序排序
  palette.sort((a, b) => b.rate - a.rate);
  return palette;
};
