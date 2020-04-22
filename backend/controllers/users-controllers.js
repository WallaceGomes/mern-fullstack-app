//const uuid = require('uuid/v4'); //gera uma id de usuário única, checar depois

//necessário para completar o processo de validação do input do front end
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

const User = require('../models/user');

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

    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(password, 12);
    }catch(err) {
        const error = new HttpError(
            'Could not create user, try again.(server hash)',
            500
        );
        return next(error);
    }

    const createdUser = new User ({
        name,
        email,
        image: req.file.path,
        password: hashedPassword, //bcrypt
        places: [] //quando cria o usuário é um array vazio e depois quando ele cria os "places" adiciona o id de cada um no array
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError('Signup failed', 500);
        return next(error); //retorna em caso de erro
    }

    let token;
    try{
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email },
            'palaversercretajwt',
            { expiresIn: '12h' }
        );
    }catch(err) {
        const error = new HttpError(
            'Signup failed',
            500
        );
        return next(error);
    }

    //codigo default para algo novo criado no server com sucesso 201 - geral 200
    res.status(201)
    .json({
        userId: createdUser.id,
        email: createdUser.email,
        token: token
    });
};

//login de usuário
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try{//valida email
        existingUser = await User.findOne({email: email});
    } catch (err) {
        const error = new HttpError(
            'Login failed',
            500
        );
        return next(error);
    }

    if(!existingUser) {
        const error = new HttpError(
            'Invalid credentials',
            401
        );
        return next(error);
    }

    let isValidPassword = false;
    try{
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    }catch(err){
        const error = new HttpError(
            'Could not login, brypt error',
            401
        );
        return next(error);
    }

    if(!isValidPassword) {
        const error = new HttpError(
            'Invalid credentials',
            401
        );
        return next(error);
    }

    let token;
    try{
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            'palaversercretajwt',
            { expiresIn: '12h' }
        );
    }catch(err) {
        const error = new HttpError(
            'Login failed',
            500
        );
        return next(error);
    }

    res.json({
        userId: existingUser.id,
        email: existingUser.email,
        token: token
    });
};

//retorna um usuário específico
// exports.getUserById = (req, res, next) => {
//     const userId = req.params.id;

//     const user = User.find(u => {
//         return u.id === userId;
//     });

//     if (!user) {
//         throw new HttpError('Could not find a place for the ID!', 404); //http-error model
//         // aqui não precisa return pois já cancela a execução da função
//     }

//     //standard success code 200
//     res.json({user}); // => {place} => {place: place}
// };

//edita informações de um usuário patch
// exports.updateUser = (req, res, next) => {
//     const { name, email, password } = req.body;

//     const userId = req.params.uid; //url

//     //cria uma cópia do elemento do array com o id procurado
//     const updatedUser = { ...User.find(u => u.id === userId) };
//     //pega a posição do elemento no array com o id procurado
//     const userIndex = User.findIndex(u => u.id === userId);

//     updatedUser.name = name;
//     updatedUser.email = email;
//     updatedUser.password = password;

//     User[userIndex] = updatedUser;

//     res.status(200).json({place: updatedUser})
// };

//deleta um usuário
// exports.deleteUser = (req, res, next) => {

//     const userId = req.params.pid; //url

//     //copia todos os elementos diferentes do userId do array para o novo array
//     User = User.filter(u => u.id !== userId);

//     res.status(200).json({message: 'User deleted'});
// };
