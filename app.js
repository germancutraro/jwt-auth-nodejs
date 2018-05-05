const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hola')
});


// In this route the token is going to be created
app.post('/login', (req, res) => {
  const user = { name: 'Sherman', age: 18 };

  jwt.sign(user, 'abc', (err, generatedToken) => {
    if (err) throw err;
    let token = `Bearer ${generatedToken}`;
    res.json({token});
  });

});

app.get('/private', ensureAuthentication, (req, res, next) => {
  res.send('You were able to enter!')
});

function ensureAuthentication(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    jwt.verify(req.token, 'abc', (err, data) => {
      if (err) throw err;
      // res.json({data})
      next();
    })
    
  } else { 
    res.sendStatus(403);
  }
}

app.listen(PORT, () => console.log(`App running on port ${PORT}`));