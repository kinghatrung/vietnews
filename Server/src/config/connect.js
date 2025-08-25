const mongoose = require('mongoose');
require('dotenv').config();

const URL_DATABASE = process.env.MONGODB_URL;

async function connect() {
  try {
    await mongoose.connect(URL_DATABASE);
    console.log('Kết nối đến database thành công');
  } catch (error) {
    console.log('Kết nối đến database thất bại', error);
  }
}

module.exports = { connect };
