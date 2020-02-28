const express = require('express');
//const bodyParser =  require('body-parser');

const placesRoutes = require('./routes/places-routes');

const app = express();

//permite o uso das rotas configuradas no respectivo arquivo de rotas
//adicionando filtro no começo somente aceita caminhos começando com o filtro
//pode haver mais variáveis após o filtro, mas não menos
app.use('/api/places', placesRoutes); // /api/places/...

app.listen(5000);
