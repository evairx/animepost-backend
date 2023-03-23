const {Schema, model} = require('mongoose');

const CarrouselSchema = new Schema({
    image: {
        type: String,
        required: false,
    },
    url: {
        type: String,
        required: false,
    }
})

module.exports = model('carrousel', CarrouselSchema);