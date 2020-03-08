const uuid = require('uuid/v4'); //gera uma id de usuário única, checar depois

const HttpError = require('../models/http-error');

const TEST_PLACES = [
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

exports.getPlaceByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const place = TEST_PLACES.find(u => {
        return u.creator === userId; 
    });

    //place => undefined
    //standard error code 404
    if (!place) {
        return next(new HttpError('Could not find a place for the ID!', 404)); //http-error model
    }

    //qualquer dado enviado com esse método é convertido para json
    //standard success code 200
    res.json({place});
};

exports.createPlace = (req, res, next) => {
    const{ title, description, coordinates, adress, creator } = req.body;
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
