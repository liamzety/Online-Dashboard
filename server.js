const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const cors = require('cors')
const path = require('path')

const app = express()
const port = process.env.PORT || 3030;
const http = require('http').createServer(app);
const socketIO = require('socket.io');
const io = socketIO(http, { transports: ['websocket'] });


// Express App Config
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
    secret: 'interview secrets',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')));
} else {
    app.use(express.static(path.resolve(__dirname, 'public')));

    const corsOptions = {
        origin: ['http://127.0.0.1:5501', 'http://localhost:5501', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    };
    app.use(cors(corsOptions));
}
const userRoutes = require('./api/user/user.routes')
const authRoutes = require('./api/auth/auth.routes')

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)

io.on('connection', (socket) => {
    const address = socket.handshake.address;
    const userAgent = socket.handshake.headers['user-agent'];

    socket.on('logout', (test) => {
        console.log('logout',)
        io.to('room').emit('update', { userAgent, address })
        socket.leave('room');
        socket.disconnect(0);

    })
    socket.on('renderDashboard', (test) => {
        socket.join('room');
        io.to('room').emit('update', { userAgent, address })
    })

});

app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

http.listen(port, () => {
    (`listening on http://localhost:${port}`)
})


