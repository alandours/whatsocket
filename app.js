const express = require('express');
const crypto = require('crypto');

const app = express();

const port = process.env.PORT || 4000;
const server = app.listen(port);

const io = require('socket.io')(server);

const data = {
    es: {
        waiting: 'Esperando...',
        online: 'en línea',
        typing: 'está escribiendo...',
        new: 'Nuevo chat',
        editProfile: 'Editar perfil',
        edit: 'Editar',
        nameDescription: 'Ingresa tu nombre y añade una foto de perfil (opcional).',
        namePlaceholder: 'Ingresa tu nombre',
        about: 'INFO.',
        unknown: 'Desconocido',
        carrier: 'Movistar',
        menu: {
            status: 'Estado',
            calls: 'Llamadas',
            camera: 'Cámara',
            chats: 'Chats',
            settings: 'Configuración'
        }
    },
    en: {
        waiting: 'Waiting...',
        online: 'online',
        typing: 'typing...',
        new: 'New chat',
        editProfile: 'Edit profile',
        edit: 'edit',
        nameDescription: 'Enter your name and add an optional profile picture.',
        namePlaceholder: 'Enter your name',
        about: 'ABOUT',
        unknown: 'Unknown',
        carrier: 'Vodafone',
        menu: {
            status: 'Status',
            calls: 'Calls',
            camera: 'Camera',
            chats: 'Chats',
            settings: 'Settings'
        }
    }
}

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    const lang = req.acceptsLanguages('es') ? 'es' : 'en';
    res.render('index', {data: data[lang]});
});

app.get('/getUserInfo', (req, res) => {
    const lang = req.acceptsLanguages('es') ? 'es' : 'en';
    res.send({data: data[lang]});
});

app.get('/edit-info', (req, res) => {
    const lang = req.acceptsLanguages('es') ? 'es' : 'en';
    res.render('edit', {data: data[lang]});
});

app.get('/chat', (req, res) => {
    const id = crypto.randomBytes(10).toString('hex');
    res.redirect('/chat/' + id);
});

app.get('/chat/:id', (req, res) => {
    const lang = req.acceptsLanguages('es') ? 'es' : 'en';
    res.render('chat', {data: data[lang]});
});

io.on('connection', (socket) => {
    io.sockets.emit('connected');

    socket.on('join room', (room) => {
        socket.join(room);
    });
    
    socket.on('send message', (data) => {
        io.sockets.in(data.room).emit('chat', data);
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    });

    socket.on('disconnect', (data) => {
        io.sockets.emit('disconnect', data);
        socket.removeAllListeners();
    });

});
