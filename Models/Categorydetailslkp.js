const mongoose = require('mongoose');



const categorydetailSchema = new mongoose.Schema({
    Name : String,
    categoryid: Number
});


module.exports = mongoose.model('categorydetailslkp', categorydetailSchema);