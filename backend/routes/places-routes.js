const express = require('express');

//check = função que checa se o parâmetro passado para validá-lo
// de acordo com as funções executadas em seguida
const { check } = require('express-validator');

const placesControllers = require('../controllers/places-controllers');

const router = express.Router();

// A ordem das rotas tem importância na execução do código

//recebe um endereço e uma função que será executada sempre que ele for chamado
//adicionando ":" à rota indica um valor dinâmico
router.get('/:pid', placesControllers.getPlaceById);

//recebe um id de usuário e retorna os "places" do mesmo
router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.post(
    '/', 
    [
        check('title').not().isEmpty(),
        check('description').isLength({ min: 5}),
        check('address').not().isEmpty()
    ],
    placesControllers.createPlace);

router.patch(
    '/:pid',
    [
        check('title').not().isEmpty(),
        check('description').isLength({ min: 5})
    ],
    placesControllers.updatePlace);

router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;
