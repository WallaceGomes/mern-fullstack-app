//const uuid = require('uuid/v4'); //gera uma id de usuário única, checar depois

//necessário para completar o processo de validação do input do front end
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const User = require('../models/user');

let USERS = [
    {
    id: 'u1',
    name: 'Wallace Gomes',
    email: 'teste@teste.com',
    password: 'testeteste'
    }
];

//retorna todos os usuários
exports.getUsers = async (req, res, next) => {

    let users;
    try {
        users = await User.find({}, '-password'); //projection -> {} objeto, -pass retorna tudo menos o pass
    }catch (err) {
        const error = new HttpError('Could not find a user!', 500);
        return next(error);
    }

    //nota: find retorna um array, por isso tem que usar map
    res.json({users: users.map(user => user.toObject({getters: true}))});
};

//cadastra um novo usuário
exports.signup = async (req, res, next) => {
        //verifica se há algum erro de validação baseado nas condições setadas nas rotas
    //se houver algum erro, retorna na variável
    //também pode conter várias informações detalhadas sobre o erro
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(
            new HttpError('Invalid inputs, check your data.', 422));
    }

    const { name, email, password } = req.body;

    let existingUser;
    try{
        existingUser = await User.findOne({email: email});
    } catch (err) {
        const error = new HttpError('Singn up failed, conection error', 500);
        return next(error);
    }

    if(existingUser) {
        const error = new HttpError('User exists already', 422);
        return next(error);
    }

    const createdUser = new User ({
        name,
        email,
        image: 'https://avatars0.githubusercontent.com/u/43701494?s=460&u=6f9699f3b36c089cd98bc13bdf51d76223192c29&v=4',
        password, //mais tarde adiconar encriptação (bcript?)
        places: [] //quando cria o usuário é um array vazio e depois quando ele cria os "places" adiciona o id de cada um no array
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError('Signup failed', 500);
        return next(error); //retorna em caso de erro
    }

    //codigo default para algo novo criado no server com sucesso 201 - geral 200
    res.status(201).json({user: createdUser.toObject({getters: true})});
};

//login de usuário
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try{//valida email
        existingUser = await User.findOne({email: email});
    } catch (err) {
        const error = new HttpError('Login failed', 500);
        return next(error);
    }

    if(!existingUser || existingUser.password !== password) {
        const error = new HttpError('Invalid credentials', 401);
        return next(error);
    }

    res.json({message: 'Loged in', user: existingUser.toObject({getters: true})});
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
