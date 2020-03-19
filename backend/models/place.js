const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//ao armazenar imagens, o ideal é armazenar o link (url) para a imagem em outro banco próprio para esse tipo de dado

const placeSchema = new Schema ({
    title: { type: String, required: true},
    description: { type: String, required: true},
    image: { type: String, required: true},
    address: { type: String, required: true},
    location: {
        lat: { type: Number, required: true},
        lng: { type: Number, required: true}
    },
    creator: { type: mongoose.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Place', placeSchema);
