const express = require('express');
const moment = require('moment-timezone');
const router = express.Router();
const email_pattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

const db = require(__dirname + '/../db_connect2');

router.get('/edit/:uid', async (req, res)=>{
    const sql = "SELECT * FROM `address_book` WHERE uid=?";
    const [result] = await db.query(sql, [req.params.uid]);
    if(result.length){
        result[0].birthday = moment(result[0].birthday).format('YYYY-MM-DD');
        res.render('address-book/edit', {row: result[0]});
    } else {
        res.redirect('/address-book/list');
    }
});

router.post('/edit', async (req, res)=>{
    const output = {
        success: false,
        body: req.body
    };
    // TODO: 檢查欄位的格式
    if(! email_pattern.test(req.body.email)){
        output.error = 'Email 格式不符';
        return res.json(output);
    }
    const updateData = { ...req.body };
    const uid = updateData.uid;
    delete updateData.uid; // 刪除屬性
    const sql = "UPDATE `address_book` SET ? WHERE uid=?";
    const [result] = await db.query(sql, [updateData, uid]);
    if(result.changedRows===1){
        output.success = true;
    }
    output.result = result;
    res.json(output);
});

router.get('/del/:uid', async (req, res)=>{
    const sql = "DELETE FROM `address_book` WHERE uid=?";
    const [result] = await db.query(sql, [req.params.uid]);
    if(req.get('Referer')){
        res.redirect( req.get('Referer') );
    } else {
        res.redirect('/address-book/list');
    }

});

router.get('/add', (req, res)=>{
    res.locals.pageName = 'address-book-add';
    res.render('address-book/add');
});

router.post('/add', async (req, res)=>{
    const output = {
        success: false,
        body: req.body
    };
    // TODO: 檢查欄位的格式
    if(! email_pattern.test(req.body.email)){
        output.error = 'Email 格式不符';
        return res.json(output);
    }

    const sql = "INSERT INTO `address_book` SET ?";
    const [result] = await db.query(sql, [req.body]);
    if(result.affectedRows===1 && result.insertId){
        output.success = true;
    }
    output.result = result;
    res.json(output);
});

router.get('/list/:page?', async (req, res)=>{
    res.locals.pageName = 'address-book-list';
    const perPage = 5; // 每一頁要顯示幾筆
    let page = parseInt(req.params.page) || 1;
    const output = {
        perPage,
        page,
        totalRows: 0,
        totalPages: 0,
        rows: []
    };

    const t_sql = "SELECT COUNT(1) num FROM address_book"; // 取得總筆數
    const [ t_r ] = await db.query(t_sql);
    output.totalRows = t_r[0].num; // 總筆數
    output.totalPages = Math.ceil(output.totalRows/perPage); // 總頁數

    // 如果沒有資料
    if(! output.totalRows){
        res.render('address-book/list', output);
        return ;
    }

    if(page<1){
        return res.redirect('/address-book/list/1');
    }
    if(page>output.totalPages){
        return res.redirect('/address-book/list/' + output.totalPages);
    }

    const sql = `SELECT * FROM address_book ORDER BY uid DESC LIMIT ${(page-1)*perPage}, ${perPage}`;
    console.log('sql:', sql);
    const [r] = await db.query(sql);
    r.forEach((el)=>{
        el.birthday = moment(el.birthday).format('YYYY-MM-DD');
    });
    output.rows = r;
    // res.json(r);
    res.render('address-book/list', output);
});

module.exports = router;