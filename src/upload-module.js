const  multer = require('multer');
const uuid = require("uuid");

const extMap = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname +'/../public/img-uploads');
    },
    filename: function (req, file, cb) {
        let ext = extMap[file.mimetype];
        if(ext){
            cb(null, uuid.v4() + ext)
        } else {
            cb(new Error('bad file type'));
        }
    }
});

const fileFilter = function(req, file, cb){
    cb(null, !!extMap[file.mimetype]);
};

const upload = multer({storage, fileFilter});

module.exports = upload;

