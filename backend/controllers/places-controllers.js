const uuid = require('uuid/v4'); //gera uma id de usuário única, checar depois

//necessário para completar o processo de validação do input do front end
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

let TEST_PLACES = [
    {
        id: 'p1',
        title: 'Teste Empire Building',
        description: 'Description test',
        location: {
            lat: 40.7484474,
            lng: -73.9871516
        },
        address: 'Teste adress',
        creator: 'u1'
    }
];

exports.getPlaceById = (req, res, next) => {
    const placeid = req.params.pid;
    const place = TEST_PLACES.find(p => {
        return p.id === placeid;
    });

    //place => undefined
    //standard error code 404
    if (!place) {
        throw new HttpError('Could not find a place for the ID!', 404); //http-error model
        // aqui não precisa return pois já cancela a execução da função
    }

    //qualquer dado enviado com esse método é convertido para json
    //standard success code 200
    res.json({place}); // => {place} => {place: place}
};

exports.getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;

    //retorna todos os elementos do array que tem o id procurado
    const places = TEST_PLACES.filter(u => {
        return u.creator === userId; 
    });

    //place => undefined
    //standard error code 404
    if (!places || places.length === 0) {
        return next(new HttpError('Could not find places for the ID!', 404)); //http-error model
    }

    //qualquer dado enviado com esse método é convertido para json
    //standard success code 200
    res.json({places});
};

exports.createPlace = (req, res, next) => {

    //verifica se há algum erro de validação baseado nas condições setadas nas rotas
    //se houver algum erro, retorna na variável
    //também pode conter várias informações detalhadas sobre o erro
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new HttpError('Invalid inputs, check your data.', 422);
    }

    const { title, description, coordinates, adress, creator } = req.body;
    //const title = req.body.title

    const createdPlace = {
        id: uuid(),
        title,
        description,
        location: coordinates,
        adress,
        creator
    };

    TEST_PLACES.push(createdPlace); //unshifit para posicionar [0]

    //codigo default para algo novo criado no server com sucesso 201 - geral 200
    res.status(201).json({place: createdPlace});
};

exports.updatePlace = (req, res, next) => {
    const { title, description} = req.body;

    //verifica se há algum erro de validação baseado nas condições setadas nas rotas
    //se houver algum erro, retorna na variável
    //também pode conter várias informações detalhadas sobre o erro
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new HttpError('Invalid inputs, check your data.', 422);
    }

    const placeId = req.params.pid; //url

    //cria uma cópia do elemento do array com o id procurado
    const updatedPlace = { ...TEST_PLACES.find(p => p.id === placeId) };
    //pega a posição do elemento no array com o id procurado
    const placeIndex = TEST_PLACES.findIndex(p => p.id === placeId);

    updatedPlace.title = title;
    updatedPlace.description = description;

    TEST_PLACES[placeIndex] = updatedPlace;

    res.status(200).json({place: updatedPlace})
};

exports.deletePlace = (req, res, next) => {

    const placeId = req.params.pid; //url

    //copia todos os elementos diferentes do plpaceId do array para o novo array
    TEST_PLACES = TEST_PLACES.filter(p => p.id !== placeId);

    res.status(200).json({message: 'Place deleted'});
};
