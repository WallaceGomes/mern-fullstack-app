const express = require('express');
const bodyParser =  require('body-parser');

const placesRoutes = require('./routes/places-routes');

const app = express();

//permite o uso das rotas configuradas no respectivo arquivo de rotas
app.use(placesRoutes);

app.listen(5000);
