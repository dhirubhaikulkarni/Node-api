const mongoose = require('mongoose');

const publisherdetailSchema = new mongoose.Schema({
    Name : String,
    publisherid: Number
});

module.exports = mongoose.model('publisherdetailslkp', publisherdetailSchema);