const express = require('express');
const bodyParser =  require('body-parser');

const HttpError = require('./models/http-error');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();

app.use(bodyParser.json());

//permite o uso das rotas configuradas no respectivo arquivo de rotas
//adicionando filtro no começo somente aceita caminhos começando com o filtro
//pode haver mais variáveis após o filtro, mas não menos
app.use('/api/places', placesRoutes); // /api/places/...
app.use('/api/users', usersRoutes);

//midleware para lidar com situações onde nenhuma rota anterior retorna um resposta
//basicamente lida com requests que não queremos
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    throw error;
})

//midleware para quando houver um erro
// o express indentifica automaticamente quando há um erro em qualquer outro midleware
// e passa a utilizar esse com error
//isso é possível por conta do quarto parâmetro, se há um quarto parâmetro,
app.use((error, req, res, next) => {

    //se uma resposta já foi enviada
    if (res.headerSent) {
        return next(error);
    }

    //mensagem de erro default
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred!'})
})

app.listen(5000);
