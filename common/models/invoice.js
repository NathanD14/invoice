'use strict';
var app = require('../../server/server.js');
var bunyan = require('bunyan');
var _ = require('lodash');
var log = bunyan.createLogger({
    name: "Invoice"
});

module.exports = function(Invoice) {
    Invoice.getAllInvoices = function(cb) {
        Invoice.find({
            include: ["billedTo","billedFrom"]
        })
        .then(function(findResult) {
            log.info('findResult: ', findResult);
            return cb(null, {
                success: true,
                msg: "findResult",
                data: findResult
            });
        })
        .catch(function(findError) {
            log.error('Something went wrong: ', findError);
            return cb(null, {
                success: false,
                msg: "Something went wrong",
                data: findError
            });
        });
    };

    Invoice.getInvoice = function(data, cb) {
        log.info('data: ', data);
        if(data.invoiceID) {
            log.info('inside');
            Invoice.findOne({
                where: {
                    invoiceID: data.invoiceID,
                    isActive: 1
                },
                include: ["billedTo","billedFrom"]
            })
            .then(function(findResult) {
                if(findResult) {
                    var result = JSON.parse(JSON.stringify(findResult));
                    log.info('result: ', findResult);
                    return cb(null, {
                        success: true,
                        msg: "Invoice found",
                        data: findResult
                    });
                }
                else {
                    log.info('no invoice found');
                    return cb(null, {
                        success: false,
                        msg: "No invoice found",
                        data: {}
                    });
                }
            })
            .catch(function(findError) {
                log.error('Something went wrong: ', findError);
                return cb(null, {
                    success: false,
                    msg: "Something went wrong",
                    data: findError
                });
            });
        }
        else {
            Invoice.getAllInvoices(function(err,res) {
                if(err||!res.success) {
                    log.error('Something went wrong: ', err?err:res);
                    return(null, err?err:res);
                }
                else{
                    log.info('result: ', res);
                    return(null, res);
                }
            });
        }
    }

    Invoice.updateInvoice = function(data, cb) {
        log.info('data: ', data);
        if(data.invoiceID) {
            Invoice.findOne({
                where: {
                    invoiceID: data.invoiceID
                }
            })
            .then(function(findResult) {
                log.info('Invoice found: ', findResult);
                findResult.updateAttributes(data)
                .then(function(updateResult) {
                    log.info('Invoice deleted successfully: ', updateResult);
                    return cb(null, {
                        success: true,
                        msg: "Invoice deleted successfully",
                        data: updateResult
                    });
                })
                .catch(function(updateError) {
                    log.error('Something went wrong: ', updateError);
                    return cb(null, {
                        success: false,
                        msg: "Something went wrong",
                        data: updateError
                    });
                });
            })
            .catch(function(findErorr) {
                log.error('Something went wrong: ', findErorr);
                return cb(null, {
                    success: false,
                    msg: "Something went wrong",
                    data: findErorr
                });
            });
        }
        else {
            log.error('Insufficient parameter: [invoiceID]');
            return cb(null, {
                success: false,
                msg: "Insufficient parameter: [invoiceID]"
            });
        }
    }

    Invoice.addInvoice = function(data, cb) {
        Invoice.create(data)
        .then(function(createResult) {
            log.info('Invoice created successfully: ', createResult);
            return cb(null, {
                success: true,
                msg: "Invoice created successfully",
                data: createResult
            });
        })
        .catch(function(createError) {
            log.error('Something went wrong: ', createError);
            return cb(null, {
                success: false,
                msg: "Something went wrong",
                data: createError
            });
        });
    }

    Invoice.findInvoice = function(data, cb) {
        Invoice.find({
            include:{
                relation:"billedTo"
            }
        })
        .then(function(findResult) {
            log.info('findResult: ', findResult);

            return cb(null, {
                success: true,
                msg: "findResult",
                data: findResult
            });
        })
        .catch(function(findError) {
            log.error('Something went wrong: ', findError);
            return cb(null, {
                success: false,
                msg: "Something went wrong",
                data: findError
            });
        });
    };

    Invoice.remoteMethod(
        'findInvoice', {
            description: "deletes invoice from database",
            accepts: {
                arg: "data",
                type: "object",
                required: true,
                default: '{"invoiceID":1}',
                http: {
                    source: "body"
                }
            },
            returns: {
                arg: "result",
                type: "object",
                root: "true"
            },
            http: {
                verb: "post"
            }
        }
    );
    Invoice.remoteMethod(
        'addInvoice', {
            description: "adds new invoice to database",
            accepts: {
                arg: "data",
                type: "object",
                required: true,
                http: {
                    source: "body"
                }
            },
            returns: {
                arg: "result",
                type: "object",
                root: "true"
            },
            http: {
                verb: "post"
            }
        }
    );

    Invoice.remoteMethod(
        'updateInvoice', {
            description: "deletes invoice from database",
            accepts: {
                arg: "data",
                type: "object",
                required: true,
                default: '{"invoiceID":1}',
                http: {
                    source: "body"
                }
            },
            returns: {
                arg: "result",
                type: "object",
                root: "true"
            },
            http: {
                verb: "post"
            }
        }
    );

    Invoice.remoteMethod(
        'getInvoice', {
            description: "fetches invoice from database",
            accepts: {
                arg: "data",
                type: "object",
                required: true,
                default: '{"invoiceID":1}',
                http: {
                    source: "body"
                }
            },
            returns: {
                arg: "result",
                type: "object",
                root: "true"
            },
            http: {
                verb: "post"
            }
        }
    );

    Invoice.remoteMethod(
        'getAllInvoices', {
            description: "fetches all invoices from database",
            returns: {
                arg: "result",
                type: "object",
                root: "true"
            },
            http: {
                verb: "get"
            }
        }
    );
};
