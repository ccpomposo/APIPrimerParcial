var express = require('express');
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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Por favor, inicie sesión' });
});
//router.get()

router.route('/login')
  .get(function (request, response) {
    response.render('login', { title: 'Por favor, inicie sesión' }); 
  })
  .post(function (request, response) {
    mongoose.model('Persona').findOne({"user": request.body.user, "pass": request.body.pass}, function (error, persona) {
      if(error) {
        throw error;
      } else {
        if(persona == null) {
          response.render('login', {title: "Usuario o contraseña incorrectos"});
        } else {
          response.render('bienvenido', {"persona": persona});
        }
      }
    })
  })

router.route('/registro')
  .get(function (request, response) {
      response.render('registro',{title:"Registrarse"});
  })
  .post(function (request, response) {
    mongoose.model('Persona').create({"nombre":request.body.nombre,
    "apellido": request.body.apellido,
"telefono": request.body.telefono,
"email": request.body.email,
"fecha_nacimiento": request.body.fecha_nacimiento,"user": request.body.user, "pass": request.body.pass}, function (error, persona) {
        if(error) {
            throw error;
        } else {
            console.log("Usuario agregado "+ persona)
            response.format( {
                html:function(argument) {
                    response.location("login");
                    response.redirect("login");
                }
            })
        }
    })
})
module.exports = router;
