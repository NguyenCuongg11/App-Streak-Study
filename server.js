const fs = require('fs');
const path = require('path');
const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');
const express = require('express');
const app = express();

// 1. Middleware ghi log truy cập
app.use((req, res, next) => {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress;
    
    const geo = geoip.lookup(ip);
    const parser = new UAParser(req.headers['user-agent']);
    const uaResult = parser.getResult();
    const deviceName = `${uaResult.os.name} ${uaResult.os.version} - ${uaResult.browser.name} ${uaResult.browser.version}`;

    const last = new Date();
    const d = String(last.getDate()).padStart(2, '0');
    const m = String(last.getMonth() + 1).padStart(2, '0');
    const y = last.getFullYear();
    const h = String(last.getHours()).padStart(2, '0');
    const min = String(last.getMinutes()).padStart(2, '0');
    const s = String(last.getSeconds()).padStart(2, '0');
    const fullTime = `${d}/${m}/${y}, ${h}:${min}:${s}`;

    // Ghi file log
    const logDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
    const logFilePath = path.join(logDir, `${d}-${m}-${y}.log`);
    const logData = `[${fullTime}] IP: ${ip} | Device: ${deviceName} | Loc: ${geo ? geo.city : 'Unknown'}\n`;
    
    fs.appendFile(logFilePath, logData, (err) => { if (err) console.error("Lỗi ghi file log"); });

    // In log màn hình
    console.log(`\n[${fullTime}] CÓ TRUY CẬP MỚI!`);
    console.log(`- IP: ${ip} | Thiết bị: ${deviceName}`);
    console.log(`- Vị trí: ${geo ? geo.city + ', ' + geo.country : 'Unknown'}`);
    
    next(); // Chuyển sang bước tiếp theo
});

// 2. Phục vụ file tĩnh (CSS, JS, images, index.html)
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "break.html"));
});

// 5. Khởi động Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Countdown đã ONLINE tại Port: ${PORT}`);
    console.log(`Đang chờ đợi IP...`);
});