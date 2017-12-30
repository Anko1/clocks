const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Clock = new Schema({
    name     : String,
    price    : Number,
    description: String,
    details  : Object,
    images   : Array,
    addText  : Array,
    colors   : Array 
}, {
    collection: 'clocks'
});


module.exports = mongoose.model('Clocks', Clock);