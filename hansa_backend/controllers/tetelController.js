const tetelService = require('../services/tetelService')
const HttpException = require("../exceptions/HttpException");
const {sendHttpException, sendServerErrorResponse} = require("../httpHandler");

module.exports.list = async (req, res) => {
    try {
        res.json( await tetelService.list(req.body));
    } catch (exception) {
        if (exception instanceof HttpException){
            sendHttpException(res, exception);
            return;
        }
        sendServerErrorResponse(res, exception.message);
    }
}

module.exports.listByVasarlas = async (req, res) => {
    try {
        res.json( await tetelService.listByVasarlas(req.params.vasarlasid));
    } catch (exception) {
        if (exception instanceof HttpException){
            sendHttpException(res, exception);
            return;
        }
        sendServerErrorResponse(res, exception.message);
    }
}

module.exports.add = async (req, res) => {
    try {
        res.json( await tetelService.add(req.body));
    } catch (exception) {
        if (exception instanceof HttpException){
            sendHttpException(res, exception);
            return;
        }
        sendServerErrorResponse(res, exception.message);
    }
}