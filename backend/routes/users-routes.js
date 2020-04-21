const express = require('express');

//check = função que checa se o parâmetro passado para validá-lo
// de acordo com as funções executadas em seguida
const { check } = require('express-validator');
const fileUpload = require('../middleware/file-upload');

const usersControllers = require('../controllers/users-controllers');

const router = express.Router();

// A ordem das rotas tem importância na execução do código

//recebe um endereço e uma função que será executada sempre que ele for chamado
//adicionando ":" à rota indica um valor dinâmico

router.get('/', usersControllers.getUsers);

router.post(
    '/signup',
    fileUpload.single('image'),
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(), //Teste@teste.com => teste@teste.com
        check('password').isLength({ min: 6 })
    ],
    usersControllers.signup);

router.post('/login', usersControllers.login);

// router.get('/user/:uid', usersControllers.getUserById);

// router.post('/user', usersControllers.createUser);

// router.patch('/user/:uid', usersControllers.updateUser);

// router.delete('/user/:uid', usersControllers.deleteUser);

module.exports = router;
