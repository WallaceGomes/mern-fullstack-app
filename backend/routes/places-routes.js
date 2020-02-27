const express = require('express');

const router = express.Router();

//recebe um endereço e uma função que será executada sempre que ele for chamado
router.get('/', (req, res, next) => {
    console.log('GET Request in Places');
    //qualquer dado enviado com esse método é convertido para json
    res.json({message: 'It works!'});
});

module.exports = router;