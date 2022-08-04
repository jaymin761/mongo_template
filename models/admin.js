const mongoose = require('mongoose');


const dataSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  }
}, {
  timestamps: true,
  toObject: { getters: true },
  toJSON: { getters: true },
}
);

module.exports = mongoose.model('admins', dataSchema);
