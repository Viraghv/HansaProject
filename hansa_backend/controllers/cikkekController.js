const cikkekService = require('../services/cikkekService');
const HttpException = require("../exceptions/HttpException");
const {sendHttpException, sendServerErrorResponse} = require("../httpHandler");

module.exports.list = async (req, res) => {
    try {
        res.json( await cikkekService.list(req.body));
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
        res.json( await cikkekService.add(req.body));
    } catch (exception) {
        if (exception instanceof HttpException){
            sendHttpException(res, exception);
            return;
        }
        sendServerErrorResponse(res, exception.message);
    }
}