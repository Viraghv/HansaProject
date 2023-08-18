const vasarlasService = require('../services/vasarlasService');
const HttpException = require("../exceptions/HttpException");
const {sendHttpException, sendServerErrorResponse} = require("../httpHandler");
const excelJs = require("exceljs");
const dataExporter = require('json2csv').Parser;

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

module.exports.exportToXLSX = async (req, res) => {
    try {
        req.body.page = null;
        let data = await vasarlasService.list(req.body);

        let workbook = new excelJs.Workbook()
        const sheet = workbook.addWorksheet("vasarlasok");
        sheet.columns = [
            {header: "ID", key: "id", width: 25},
            {header: "Időpont", key: "esemenydatumido", width: 25},
            {header: "Összeg", key: "vasarlasosszeg", width: 25},
            {header: "Pénztárgép azonosító", key: "penztargepazonosito", width: 25},
            {header: "Partner ID", key: "partnerid", width: 25},
            {header: "Bolt", key: "boltnev", width: 25},
        ];

        data.map(item => {
            sheet.addRow({
                ...item,
            });
        })

        sheet.getColumn("esemenydatumido").numFmt = 'yyyy-mm-dd hh:mm:ss'

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment;filename=vasarlasok.xlsx"
        );

        await workbook.xlsx.write(res);
    } catch (exception) {
        if (exception instanceof HttpException){
            sendHttpException(res, exception);
            return;
        }
        sendServerErrorResponse(res, exception.message);
    }
}

module.exports.exportToCSV = async (req, res) => {
    try {
        req.body.page = null;
        let data = await vasarlasService.list(req.body);

        data.map(value => {
            value.esemenydatumido = formatDate(value.esemenydatumido);
        });

        let fileHeader = [
            {label: "ID", value: "id"},
            {label: "Időpont", value: "esemenydatumido"},
            {label: "Összeg", value: "vasarlasosszeg"},
            {label: "Pénztárgép azonosító", value: "penztargepazonosito"},
            {label: "Partner ID", value: "partnerid"},
            {label: "Bolt", value: "boltnev"},
        ];
        let jsonData = new dataExporter({
            fields: fileHeader,
            delimiter: ";",
            withBOM: true,
        });
        let csvData = jsonData.parse(data);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            "attachment;filename=vasarlasok.csv"
        );

        res.status(200).end(csvData);

    } catch (exception) {
        if (exception instanceof HttpException){
            sendHttpException(res, exception);
            return;
        }
        sendServerErrorResponse(res, exception.message);
    }
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-') +
        ' ' +
        [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),
        ].join(':')
    );
}