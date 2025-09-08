// src/app/models/UsersModel.js
const { default: mongoose } = require("mongoose");

const UsersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    unique: true,
    default: null, // Allow null initially, will be set on first login
  },
});

const UsersModel = mongoose.models.E_USERS || mongoose.model('E_USERS', UsersSchema);

export default UsersModel;