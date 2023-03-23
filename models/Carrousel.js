import { Schema, model } from 'mongoose';

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

export default  model('carrousel', CarrouselSchema);