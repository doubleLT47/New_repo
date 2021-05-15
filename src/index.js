
require('dotenv').config();

const express = require('express');
const app = express();
const http = require("http");

const socketIo = require("socket.io");
const server = http.createServer(app);
const path = require('path');
const morgan = require('morgan');
const exphbs  = require('express-handlebars');
const passport = require('passport');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');

const route = require('./routes');
const db = require('./config/db');

db.connect(); 


const port = process.env.PORT || 8008;

const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(morgan('combined'));
app.engine('.hbs', exphbs({
  extname: '.hbs',
  helpers: {
    and: (a,b) => a===b,
    not: (a,b) => a !== b
  }}));
app.set('view engine', '.hbs');
app.set('views',path.join(__dirname, 'resources/views'))


// Route init
route(app);
 
server.listen(port, ()=> console.log(`Server is running at http://localhost:${port}`));


io.on('connection', function(socket) {
  console.log(`Client ${socket.id} connected`);

  socket.on('disconnect', ()=> {
    console.log(`${socket.id} disconnected`);
  });

  socket.on('notice-to-server', (data)=> {
    io.emit('notice-to-user', {userName: data.userName, id: data.newId});
  })
})