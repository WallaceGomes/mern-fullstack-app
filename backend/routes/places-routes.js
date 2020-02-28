const express = require('express');

const router = express.Router();

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

// A ordem das rotas tem importância na execução do código

//recebe um endereço e uma função que será executada sempre que ele for chamado
//adicionando ":" à rota indica um valor dinâmico
router.get('/:pid', (req, res, next) => {
    const placeid = req.params.pid;
    const place = TEST_PLACES.find(p => {
        return p.id === placeid;
    });
    //qualquer dado enviado com esse método é convertido para json
    res.json({place}); // => {place} => {place: place}
});

//recebe um id de usuário e retorna os "places" do mesmo
router.get('/user/:uid', (req, res, next) => {
    const userId = req.params.uid;
    const place = TEST_PLACES.find(u => {
        return u.creator === userId; 
    });
    res.json({place});
});

module.exports = router;