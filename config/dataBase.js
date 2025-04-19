const mongoose = require('mongoose');

function connectDB() {
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log('Connected to MongoDB successfully!');
    }).catch((err) => {
        console.error('Error connecting to MongoDB:');
    })
}

module.exports = connectDB;