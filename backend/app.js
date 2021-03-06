const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser =  require('body-parser');
const mongoose = require('mongoose');

const HttpError = require('./models/http-error');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

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

    if (req.file) {
        fs.unlink(req.file.path, err => {
            console.log(err);
        });
    }
    //se uma resposta já foi enviada
    if (res.headerSent) {
        return next(error);
    }

    //mensagem de erro default
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred!'})
})

//user: mernapp
//pass: testmern
// mongodb+srv://mernapp:testmern@clustermern-hwzsp.mongodb.net/test?retryWrites=true&w=majority

//conexão com o banco de dados
mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_NAME}-hwzsp.mongodb.net/mern?retryWrites=true&w=majority`, { useNewUrlParser: true })
    .then(() => { // conexão ok
        app.listen(process.env.PORT || 5000);
    })
    .catch(err => { // conexão falhou
        console.log(err);
    });
