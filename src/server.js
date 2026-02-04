const express = require('express');
const bodyParser = require('body-parser');
const { handleUSSD } = require('./ussd');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/ussd', async (req, res) => {
  const response = await handleUSSD(req.body);
  res.send(response);
});

app.listen(3000, () => {
  console.log('USSD server running on port 3000');
});
