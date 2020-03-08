class HttpError extends Error {
    constructor(message, errorCorde) {
        super(message); //adiciona uma mensagem à classe
        this.code = errorCorde; // adiciona um código de erro à class
    }
}

module.exports = HttpError;