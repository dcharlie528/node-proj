const express = require("express");
// const multer = require('multer');
const uuid = require("uuid");
const { param } = require("./routes/admin2");
// const {v4: uuidv4} = require('uuid');
// const upload = multer({dest:"tmp_upload"});
const upload = require(__dirname + '/upload-module');
const db = require(__dirname + '/db_connect2');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const moment = require('moment-timezone');
const sessionStore = new MysqlStore({}, db);

const app = express();
// Top-level middlewares

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: 'aaaaaaaaqq',
    saveUninitialized: false,
    resave: false,
    store: sessionStore,
    cookie: {
        maxAge: 1800000
    }
}));




// custom middleware
app.use((req, res, next) => {
    res.locals.pageName = '';  //直接下在local，所有template都吃得到
    res.locals.myVar = {
        name: 'charlie',
        age: 26
    };
    next();
});
app.get("/", function (req, res) {
    res.locals.pageName = 'home';
    res.render("main", {
        name: 'dcharlie',
    });
});

// app.get("/abc",function(req,res){
//     res.send("<h1>Hello ABC</h1>");
// });

app.get("/json-sales", (req, res) => {
    const sales = require(__dirname + "/../data/sales.json");
    // console.log(data);
    // res.json(data);
    res.render("json-sales", { sales });
});

app.get("/try-qs", function (req, res) {
    res.json(req.query);
});

app.get('/try-post-form', (req, res) => {
    res.render('try-post-form');
});

app.post('/try-post-form', (req, res) => {
    res.render('try-post-form', req.body);
    // res.json(req.body);
});

app.post('/try-upload', upload.single('avatar'), (req, res) => {
    res.json(req.file);
});

app.post('/try-upload-multi', upload.array('myphoto', 5), (req, res) => {
    res.json(req.files);
});

app.get('/try-uuid', function (req, res) {
    res.json({
        a: uuid.v4(),
        b: uuid.v4(),
    });
});

app.post('/try-post', (req, res) => {
    // req.body.加料 = '哈囉';
    res.json(req.body);
});

app.get('/pending', (req, res) => {
});

app.get('/my-params1/:action?/:id?', (req, res) => {
    // res.json(req.params);
    res.json({
        locals: res.locals,
        params: req.params,
        session: req.session
    })
});

// app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res) => {
//     let u = req.url;
//     u = u.slice(3).split('-').join('');
//     u = u.split('?')[0];
//     res.json({
//         url: req.url,
//         手機: u
//     });
// });

app.get('/try-db', (req, res) => {
    const sql = "select * from address_book";
    db.query(sql)
        .then(([results]) => {
            res.json(results);
        });
});

app.get('/try-db2', async (req, res) => {
    const sql = "SELECT * FROM address_book";
    const [results, fields] = await db.query(sql);
    res.json(results);
});

// const admin2Router = require(__dirname + '/routes/admin2');
// app.use(admin2Router);

app.use('/admins', require(__dirname + '/routes/admin2'));

app.get('/try-session', (req, res, next) => {
    req.session.my_var = req.session.my_var || 0;
    req.session.my_var++;
    res.json({
        my_var: req.session.my_var,
        session: req.session
    });
});

app.get('/try-moment', (req, res, next) => {
    const fm = 'YYYY-MM-DD HH:mm:ss';
    const mo1 = moment(req.session.cookie.expires);
    const mo2 = moment(new Date());

    res.json([
        mo1.format(fm),
        mo2.format(fm),
        mo1.tz('asia/tokyo').format(fm),
        mo2.tz('Europe/London').format(fm),
    ]);

});

app.use('/address-book', require(__dirname + '/routes/address-book'));


app.use(express.static("public"));

app.use(function (req, res, next) {
    res.type('text/plain');
    res.status(404);
    res.send('404-cant found');
});



app.listen(3000, function () {
    console.log("server started,port:3000");
});

