const express = require('express');
const router = express.Router();

const db = require(__dirname + '/../db_connect2');

router.get('/list/:page?', async (req, res)=>{
    let page = parseInt(req.params.page) || 1;
    const perPage = 5; // 每一頁要顯示幾筆
    const sql = `SELECT * FROM address_book LIMIT ${(page-1)*perPage}, ${perPage}`;
    const [r] = await db.query(sql);

    res.json(r);
});

module.exports = router;