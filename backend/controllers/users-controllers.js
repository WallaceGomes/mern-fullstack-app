const uuid = require('uuid/v4'); //gera uma id de usuário única, checar depois

//necessário para completar o processo de validação do input do front end
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

let USERS = [
    {
    id: 'u1',
    name: 'Wallace Gomes',
    email: 'teste@teste.com',
    password: 'testeteste'
    }
];

//retorna todos os usuários
exports.getUsers = (req, res, next) => {
    res.json({users: USERS});
};

//cadastra um novo usuário
exports.signup = (req, res, next) => {
    const { name, email, password } = req.body;

    //verifica se há algum erro de validação baseado nas condições setadas nas rotas
    //se houver algum erro, retorna na variável
    //também pode conter várias informações detalhadas sobre o erro
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new HttpError('Invalid inputs, check your data.', 422);
    }

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

//login de usuário
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

//retorna um usuário específico
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

//edita informações de um usuário patch
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

//deleta um usuário
exports.deleteUser = (req, res, next) => {

    const userId = req.params.pid; //url

    //copia todos os elementos diferentes do userId do array para o novo array
    USERS = USERS.filter(u => u.id !== userId);

    res.status(200).json({message: 'User deleted'});
};
