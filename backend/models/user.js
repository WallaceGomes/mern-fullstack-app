const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema ({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true}, //unique: não é um impedimento para haver dois emails iguais no DB, somente otimização
    password: { type: String, required: true, minlength: 6},
    image: { type: String, required: true},
    places: { type: String, required: true}
});

userSchema.plugin(uniqueValidator); //aqui que valida se já tem um email igual cadastrado

module.exports = mongoose.model('User', userSchema);
