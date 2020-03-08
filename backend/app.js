const express = require('express');
//const bodyParser =  require('body-parser');

const placesRoutes = require('./routes/places-routes');

const app = express();

//permite o uso das rotas configuradas no respectivo arquivo de rotas
//adicionando filtro no começo somente aceita caminhos começando com o filtro
//pode haver mais variáveis após o filtro, mas não menos
app.use('/api/places', placesRoutes); // /api/places/...


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
