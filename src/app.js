const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const handle = require('express-handlebars');
const override = require('method-override')
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
var cookieParser = require('cookie-parser')


const app = express();
require('./database');
require('./config/passport');


app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', handle({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: {
        puntito: function (precio) {
            return (Intl.NumberFormat("de-DE").format(precio) + ' €')
        }
    }
}))
app.set('view engine', '.hbs')

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});
app.use(multer({
    storage
}).any('fotoVivienda'))

app.use(override('_method'))

app.use(cookieParser())

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


app.use(require('./routes'))


app.use(express.static(path.join(__dirname, 'public')))

module.exports = app