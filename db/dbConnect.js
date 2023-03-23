import mongoose from 'mongoose';

const URI = "mongodb+srv://evairx:UJysp6DPYZgzlnwx@cluster0.qgi6bph.mongodb.net/anime";

mongoose.connect(URI)
    .then(() => {
        console.log('DB is connected');
    })
    .catch(() => {
        console.log('DB is not connected');
    });

