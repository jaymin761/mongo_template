'use strict';
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');

module.exports = {
  up: async (models, mongoose) => {
    const saltRounds = 10;
    const myPlaintextPassword = "123456";
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(myPlaintextPassword, salt);
    await Admin.deleteMany({});
    return await Admin.create({
      name: 'Admin',
      email: 'admin@admin.com',
      password: hash,

    })
  },

  down: async (models, mongoose) => {
    await Admin.deleteMany({});
  }
};
