require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const connectDB = require('./server/config/db');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');      

const app = express();

app.use(express.static('public'));

const PORT = 3000 || process.env.PORT;

connectDB();
const {isActiveRoute} = require('./server/helpers/routeHelpers');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL
    })
}));

app.use(expressLayout);
app.set('layout','./layouts/main');
app.set('view engine','ejs');

app.locals.isActiveRoute = isActiveRoute;

app.use('/',require('./server/routes/main'));
app.use('/',require('./server/routes/admin'));

app.listen(PORT,() => {
    console.log(`Listing on port:${PORT}`);
});