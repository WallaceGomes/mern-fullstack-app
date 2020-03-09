const uuid = require('uuid/v4'); //gera uma id de usuário única, checar depois

const HttpError = require('../models/http-error');

let USERS = [
    {
    id: 'u1',
    name: 'Wallace Gomes',
    email: 'teste@teste.com',
    password: 'testeteste'
    }
];

exports.getUsers = (req, res, next) => {
    res.json({users: USERS});
};

exports.signup = (req, res, next) => {
    const { name, email, password } = req.body;

    const hasUser = USERS.find(u => u.email === email);

    if(hasUser) {
        throw new HttpError('User already exists', 422); // 422 invalid user input
    }

    const createdUser = {
        id: uuid(),
        name, //name: name
        email,
        password
    };

    USERS.push(createdUser); //unshifit para posicionar [0]

    //codigo default para algo novo criado no server com sucesso 201 - geral 200
    res.status(201).json({user: createdUser});
};

exports.login = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedUser = USERS.find(u => {
        return u.email === email
    });

    if(!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('Could not identify user, email or password wrong', 401); // 401 autentication error
    }

    res.json({message: 'loged in'});;
};

exports.getUserById = (req, res, next) => {
    const userId = req.params.id;

    const user = USERS.find(u => {
        return u.id === userId;
    });

    if (!user) {
        throw new HttpError('Could not find a place for the ID!', 404); //http-error model
        // aqui não precisa return pois já cancela a execução da função
    }

    //standard success code 200
    res.json({user}); // => {place} => {place: place}
};

// exports.createUser = (req, res, next) => {
//     const { name, email, password } = req.body;
//     //const title = req.body.title

//     const createdUser = {
//         id: uuid(),
//         name,
//         email,
//         password
//     };

//     USERS.push(createdUser); //unshifit para posicionar [0]

//     //codigo default para algo novo criado no server com sucesso 201 - geral 200
//     res.status(201).json({user: createdUser});
// };

exports.updateUser = (req, res, next) => {
    const { name, email, password } = req.body;

    const userId = req.params.uid; //url

    //cria uma cópia do elemento do array com o id procurado
    const updatedUser = { ...USERS.find(u => u.id === userId) };
    //pega a posição do elemento no array com o id procurado
    const userIndex = USERS.findIndex(u => u.id === userId);

    updatedUser.name = name;
    updatedUser.email = email;
    updatedUser.password = password;

    USERS[userIndex] = updatedUser;

    res.status(200).json({place: updatedUser})
};

exports.deleteUser = (req, res, next) => {

    const userId = req.params.pid; //url

    //copia todos os elementos diferentes do userId do array para o novo array
    USERS = USERS.filter(u => u.id !== userId);

    res.status(200).json({message: 'User deleted'});
};

