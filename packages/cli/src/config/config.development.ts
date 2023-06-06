export default {
  rootRoleId: 1,
  // nodemailer config
  mailer: {
    host: 'xxx',
    port: 80,
    auth: {
      user: 'xxx',
      pass: 'xxx',
    },
    secure: false, // or true using 443
  },
  // amap config
  amap: {
    key: 'xxx',
  },
  // jwt sign secret
  jwt: {
    secret: process.env.JWT_SECRET || '123456',
  },
  redis: {
    host: `${process.env.HOST || '127.0.0.1'}`, // default value
    port: 6379, // default value
    password: 'redis12345',
    db: 0,
  },
};
