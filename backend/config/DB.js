const mongoose = require('mongoose');
const color = require('colors');

const conenctDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useFindAndModify: true,
    });
    console.log(`Database is Connected: ${conn.connection.host}`.yellow.bold);
  } catch (err) {
    console.log(err.message);
    // process.exit();
  }
};

module.exports = conenctDB;