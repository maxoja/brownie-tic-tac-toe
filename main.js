const express = require('express');
const bodyParser = require('body-parser');
const port = 4001

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/xo/health', (req, res) => {
  res.sendStatus(200)
})
app.post('/xo/post-test', (req, res) => {
  console.log('Got body:', req.body);
  res.sendStatus(200);
});

app.listen(port, () => console.log(`Started server at http://localhost:${port}`));
