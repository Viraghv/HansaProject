const vasarlasService = require('../services/vasarlasService')
const HttpException = require("../exceptions/HttpException");
const {sendHttpException, sendServerErrorResponse} = require("../httpHandler");

module.exports.list = async (req, res) => {
    try {
        res.json( await vasarlasService.list(req.body));
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
        res.json( await vasarlasService.add(req.body));
    } catch (exception) {
        if (exception instanceof HttpException){
            sendHttpException(res, exception);
            return;
        }
        sendServerErrorResponse(res, exception.message);
    }
}