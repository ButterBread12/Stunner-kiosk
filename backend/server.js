const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const five = require("johnny-five");

const app = express();
const port = 8000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'kiosk',
  password: 'goldenglow290$',
  port: 5432,
});

app.use(cors({
  origin: 'http://localhost:8080',
  methods: 'GET',
}));

app.get('/data/:division', async (req, res) => {
  try {
    const division = req.params.division;
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM product WHERE p_division = '${division}'`);
    const data = result.rows;
    client.release();

    res.json(data);
  } catch (error) {
    console.error('데이터베이스에서 데이터를 가져오는 중 오류 발생:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 새로운 엔드포인트 설정
app.get('/order', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM product WHERE p_division = '${division}'`);
    const data = result.rows[0];  // 첫 번째 행을 선택
    client.release();

    const board = new five.Board({
      port: "COM5"
    });

    board.on("ready", function() {
      const lcd = new five.LCD({ 
        controller: "PCF8574A" 
      });
  
      lcd.print(`주문내역: ${data.order_details}`);  // 주문 내역을 디스플레이에 출력
    });

    res.json({ message: '주문 정보가 아두이노에 전송되었습니다.' });
  } catch (error) {
    console.error('데이터베이스에서 데이터를 가져오는 중 오류 발생:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
