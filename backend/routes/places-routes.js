const express = require('express');

const placesControllers = require('../controllers/places-controllers');

const router = express.Router();

// A ordem das rotas tem importância na execução do código

//recebe um endereço e uma função que será executada sempre que ele for chamado
//adicionando ":" à rota indica um valor dinâmico
router.get('/:pid', placesControllers.getPlaceById);

//recebe um id de usuário e retorna os "places" do mesmo
router.get('/user/:uid', placesControllers.getPlaceByUserId);

module.exports = router;
