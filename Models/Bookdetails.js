const mongoose = require('mongoose');

const { Schema } = mongoose;

const bookdetailSchema = new mongoose.Schema({
    bookname : String,
    Category: { type: Schema.Types.ObjectId, ref: 'categorydetailslkp' },
    Publisher: { type: Schema.Types.ObjectId, ref: 'publisherdetailslkp' },
    quantity: String,
    BDID: Number,
    IsActive: {type: Boolean, default: true},
});

module.exports = mongoose.model('bookdetails', bookdetailSchema);