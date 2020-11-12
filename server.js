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
// const WebSocket = require('isomorphic-ws');

// const ws = new WebSocket('wss://echo.websocket.org/');
// ws.onopen = function open() {
//     console.log('connected');
//     ws.send(Date.now());
// };

// ws.onclose = function close() {
//     console.log('disconnected');
// };

// ws.onmessage = function incoming(data) {
//     console.log(`Roundtrip time: ${Date.now() - data.data} ms`);

//     // setTimeout(function timeout() {
//     //     ws.send(Date.now());
//     // }, 1000);
// };


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
    // console.log('socket', socket)
    console.log('a user connected');
    // setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
});

app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

http.listen(port, () => {
    (`listening on http://localhost:${port}`)
})


