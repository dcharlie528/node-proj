const http = require("http");
const server = http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    res.end(`<h2>hohohohohohoho 123</h2>
    <P>${req.url}<P>`);
});
server.listen(3000);