const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'feedback',
  password: 'hellosql',
  port: 5432,
});

pool.query('SELECT * FROM feedback', (err, result) => {
  if (err) {
    console.log(err);
  } else {
    console.log(result.rows);
  }
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/feedback.html');
});

app.post('/submit-feedback', (req, res) => {
  const { name, email, message } = req.body;
  pool.query(
    'INSERT INTO feedback (name, email, message) VALUES ($1, $2, $3)',
    [name, email, message],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error submitting feedback');
      } else {
        console.log('Feedback submitted successfully');
        res.sendFile(__dirname + '/public/thank-you.html');
      }
    }
  );
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
