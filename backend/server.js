const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');  // cors 모듈 추가

const app = express();
const port = 8000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'goldenglow290$',
  port: 5432,
});

// CORS 미들웨어 추가
app.use(cors({
  origin: 'http://localhost:8080', // 프론트엔드 서버의 도메인으로 변경
  methods: 'GET',
}));

app.get('/data', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM product');
    const data = result.rows;
    client.release();

    res.json(data);
  } catch (error) {
    console.error('데이터베이스에서 데이터를 가져오는 중 오류 발생:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
