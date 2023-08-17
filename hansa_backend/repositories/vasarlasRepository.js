const { PrismaClient } = require('@prisma/client');
const InternalServerError = require("../exceptions/InternalServerError");
const BadRequest = require("../exceptions/BadRequest");

const prisma = new PrismaClient();
const pageSize = 25;

module.exports.list = async (filterData) => {
    let whereObject, orderByObject;

    if(filterData.searchColumn !== "" && filterData.searchTerm !== "")
        if(["id", "vasarlasosszeg", "penztargepazonosito", "partnerid"].includes(filterData.searchColumn)){
            whereObject = {
                [filterData.searchColumn]: {
                    equals: Number(filterData.searchTerm) ?  Number(filterData.searchTerm) : undefined,
                }
            }
        } else if(["esemenydatumido"].includes(filterData.searchColumn)) {
            whereObject = {
                [filterData.searchColumn]: {
                    equals: new Date(String(filterData.searchTerm)),
                }
            }
        } else if(filterData.searchColumn === "boltnev") {
            whereObject = {
                bolt: {
                    nev: {
                        contains: String(filterData.searchTerm),
                        mode: 'insensitive',
                    }
                }
            }
        }

    if(filterData.orderBy !== "" && filterData.orderType !== ""){
        if(filterData.orderBy === "boltnev"){
            orderByObject = {
                bolt: {
                    nev: filterData.orderType
                }
            }
        } else {
            orderByObject = {
                [filterData.orderBy]: filterData.orderType,
            }
        }
    }

    try {
        if(filterData.page === null){
            return await prisma.vasarlas.findMany({
                where: whereObject,
                select: {
                    id: true,
                    esemenydatumido: true,
                    vasarlasosszeg: true,
                    penztargepazonosito: true,
                    partnerid: true,
                    bolt: {
                        select: {
                            nev: true,
                        }
                    }
                },
                orderBy: orderByObject,
            });
        } else {
            let response = {};
            response.result = await prisma.vasarlas.findMany({
                skip: (filterData.page - 1) * pageSize,
                take: pageSize,
                where: whereObject,
                select: {
                    id: true,
                    esemenydatumido: true,
                    vasarlasosszeg: true,
                    penztargepazonosito: true,
                    partnerid: true,
                    bolt: {
                        select: {
                            nev: true,
                        }
                    },
                    vasarlastetelek: {
                        select: {
                            id: true,
                            mennyiseg: true,
                            brutto: true,
                            partnerid: true,
                            cikk: true,
                        }
                    }

                },
                orderBy: orderByObject,
            });

            response.count = await prisma.vasarlas.count({
                where: whereObject,
            })

            return response;
        }
    } catch (error) {
        console.log(error);
        throw new InternalServerError("Something went wrong!");
    } finally {
        await prisma.$disconnect();
    }
}

module.exports.add = async (vasarlasData) => {
    try {
        await prisma.vasarlas.create({
            data: {
                ...vasarlasData
            }
        });
    } catch (error) {
        if(error.meta.field_name === 'Vasarlas_boltid_fkey (index)') {
            throw new BadRequest("'boltid' doesn't match any existing record.");
        }

        console.log(error);
        throw new InternalServerError("Something went wrong!");
    } finally {
        await prisma.$disconnect();
    }
}