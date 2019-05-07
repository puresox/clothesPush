module.exports = {
  // port
  port: 3000,
  // keys
  keys: ['im a newer secret', 'i like turtle'],

  secret: '',

  mongodb: 'mongodb://username:password@host:port/database',
  // cookie配置
  cookie: {
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: true,
  },
  AppId: '',
  AppSecret: '',
  // 和风天气
  key: '',
};
