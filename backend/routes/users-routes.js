const express = require('express');

const usersControllers = require('../controllers/users-controllers');

const router = express.Router();

// A ordem das rotas tem importância na execução do código

//recebe um endereço e uma função que será executada sempre que ele for chamado
//adicionando ":" à rota indica um valor dinâmico

router.get('/', usersControllers.getUsers);

router.post('/signup', usersControllers.signup);

router.post('/login', usersControllers.login);

// router.get('/user/:uid', usersControllers.getUserById);

// router.post('/user', usersControllers.createUser);

// router.patch('/user/:uid', usersControllers.updateUser);

// router.delete('/user/:uid', usersControllers.deleteUser);

module.exports = router;
