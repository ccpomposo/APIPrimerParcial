var express = require('express')
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

router.use(bodyParser.urlencoded({extended: true}))
router.use(methodOverride(function (request, response) {
    if(request.body && typeof request.body == 'object' && '_method' in request.body) {
        var method = request.body._method;
        delete request.body._method;
        return method;
    }
}))

router.route('/')
    .post(function (request, response) {
        mongoose.model('Persona').create({"nombre":request.body.nombre,
        "apellido": request.body.apellido,
    "telefono": request.body.telefono,
    "email": request.body.email,
    "fecha_nacimiento": request.body.fecha_nacimiento}, function (error, persona) {
            if(error) {
                throw error;
            } else {
                console.log("Dato guardado "+ persona)
                response.format( {
                    html:function(argument) {
                        response.location("/personas");
                        response.redirect("/personas");
                    }
                })
            }
        })
    })
    .get(function (request, response, next) {
        mongoose.model('Persona').find({},function(error, personas){
            if(error) {
                throw error;
            } else {
                response.format({
                    html:function() {
                        response.render('persona/index',{title: 'Lista de personas',
                    'personas': personas});
                    },
                    json:function() {
                        response.json(personas);
                    }
                });
            }
        });
    });

router.route('/agregar').get(function (request, response) {
    response.render('persona/agregar',{title:"Agregar Persona"});
});

router.route('/actualizar')
    .post(function (request, response) {
        console.log(request.body);
        mongoose.model('Persona').findOneAndUpdate({"telefono": request.body.telefono}, {$set:{"nombre":request.body.nombre,
        "apellido": request.body.apellido,
    "telefono": request.body.telefono,
    "email": request.body.email,
    "fecha_nacimiento": request.body.fecha_nacimiento}}, {new: true}, function (error, persona) {
            if(error) {
                throw error;
            } else {
                //persona.save();
                console.log("Dato actualizado "+ persona)
                response.format( {
                    html:function(argument) {
                        response.location("/personas");
                        response.redirect("/personas");
                    }
                })
            }
        })
    })
    .get(function (request, response) {
        mongoose.model('Persona').findOne({"telefono": request.query.telefono}, function (error, persona) {
            if(error) {
                throw error;
            } else {
                response.render('persona/actualizar',{title:"Actualizar persona","persona": persona});
            }            
        })
    })

router.route('/eliminar').get(function (request, response) {
    mongoose.model('Persona').find({"telefono": request.query.telefono}).remove(function (error, persona) {
        if(error) {
            throw error;
        } else {
            console.log("Dato eliminado "+ persona)
            response.format( {
                html:function(argument) {
                    response.location("/personas");
                    response.redirect("/personas");
                }
            })    
        }        
    })    
})
router.route('/buscar').post(function (request, response) {
    mongoose.model('Persona').find({"nombre": new RegExp(request.body.nombre,"i")}, function (error, personas) {
        if(error) {
            throw error;
        } else {
            response.format({
                html:function() {
                    response.render('persona/index',{title: 'Resultado',
                'personas': personas});
                },
                json:function() {
                    response.json(personas);
                }
            });
        }
    })    
})
module.exports = router;