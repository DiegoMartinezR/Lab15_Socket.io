var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 3000;
var io = require('socket.io')(http);
var user = require('./models/user');



app.set('view engine', 'jade');
app.use('/static', express.static('public'));

io.on('connection', function (socket) {

    console.log('Usuario conectado');
    
    user.show(function (data) {
        io.emit('listar', data);
    });

    socket.on('crear', function (data) {
        user.create(data, function (rpta) {
            io.emit('nuevo', rpta);
        });
    });
    socket.on('actualizar', function (data) {
        user.actualizar(data, function (rpta) {
            io.emit('nuevo', rpta);
        });
    });
    socket.on('eliminar', function (data) {
        user.delete(data, function (rpta) {
            io.emit('borrado', rpta);
        });
    });
    
    socket.on('disconnect', function () {
        // console.log('Usuario desconectado');
    });

});




app.get('/', function (req, res) {
    res.render('main');
});

http.listen(port, function () {
    console.log(`Server connected in *: ${port}`);
});
