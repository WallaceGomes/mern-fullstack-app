//const uuid = require('uuid/v4'); //gera uma id de usuário única, checar depois

//necessário para completar o processo de validação do input do front end
const { validationResult } = require('express-validator');

const getCoordsForAddress = require('../util/location');

const HttpError = require('../models/http-error');

const Place = require('../models/place');

// let TEST_PLACES = [
//     {
//         id: 'p1',
//         title: 'Teste Empire Building',
//         description: 'Description test',
//         location: {
//             lat: 40.7484474,
//             lng: -73.9871516
//         },
//         address: 'Teste adress',
//         creator: 'u1'
//     }
// ];

exports.getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;

    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a place!', 500);
        return next(error);
    }


    //place => undefined
    //standard error code 404
    if (!place) {
        throw new HttpError('Could not find a place for the ID!', 404); //http-error model
        // aqui não precisa return pois já cancela a execução da função
    }

    //qualquer dado enviado com esse método é convertido para json
    //standard success code 200
    res.json({ place: place.toObject( { getters: true }) }); // => {place} => {place: place}
    // { getters: true } = retirar o "_" do _id do banco
};

exports.getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let places;

    try {
        places = await Place.find({ creator: userId });
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a place to the id!', 500);
        return next(error);
    }
    

    //place => undefined
    //standard error code 404
    if (!places || places.length === 0) {
        return next(new HttpError('Could not find places for the ID!', 404)); //http-error model
    }

    //qualquer dado enviado com esse método é convertido para json
    //standard success code 200
    res.json({places: places.map(place => (place.toObject( {getters: true})))});
};

exports.createPlace = async (req, res, next) => {

    //verifica se há algum erro de validação baseado nas condições setadas nas rotas
    //se houver algum erro, retorna na variável
    //também pode conter várias informações detalhadas sobre o erro
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       return next(new HttpError('Invalid inputs, check your data.', 422));
    }

    const { title, description, address, creator } = req.body;
    //const title = req.body.title

    let coordinates;
    try {
      coordinates = await getCoordsForAddress(address);
    } catch (error) {
      return next(error);
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'https://media.gettyimages.com/photos/empire-state-building-at-sunset-picture-id171080501?s=612x612',
        creator
    });

    //salva no banco de dados
    try {
        await createdPlace.save();
    } catch (err) {
        const error = new HttpError('Create place failed', 500);
        return next(error); //retorna em caso de erro
    }

    //codigo default para algo novo criado no server com sucesso 201 - geral 200
    res.status(201).json({place: createdPlace});
};

exports.updatePlace = async (req, res, next) => {

    //verifica se há algum erro de validação baseado nas condições setadas nas rotas
    //se houver algum erro, retorna na variável
    //também pode conter várias informações detalhadas sobre o erro
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(
            new HttpError('Invalid inputs, check your data.', 422));
    }

    const { title, description} = req.body;
    const placeId = req.params.pid; //url

    let place;

    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update a place to the id!', 500);
        return next(error);
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update a place to the id!', 500);
        return next(error);
    }

    res.status(200).json({place: place.toObject({ getters: true })});
};

exports.deletePlace = async (req, res, next) => {

    const placeId = req.params.pid; //url

    let place;

    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could find a place to the id!', 500);
        return next(error);
    }

    try {
       await place.remove();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete the place to the id!', 500);
        return next(error);
    }

    res.status(200).json({message: 'Place deleted'});
};
