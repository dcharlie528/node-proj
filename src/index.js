const express = require("express");
// const multer = require('multer');
const uuid = require("uuid");
// const {v4: uuidv4} = require('uuid');
// const upload = multer({dest:"tmp_upload"});
const upload = require(__dirname + '/upload-module');
const db = require(__dirname+ '/db_connect2')

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", function (req, res) {
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

app.get('/my-params1/*/*?', (req, res) => {
    res.json(req.params);
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
        .then(([results])=>{
            res.json(results);
        });
    });







app.use(express.static("public"));

app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404-cant found');
});



app.listen(3000, function () {
    console.log("server started,port:3000");
});

