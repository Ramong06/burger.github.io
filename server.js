const express = require('express');
const routes = require('./controllers/burgers-controller');
const exphbs = require('express-handlebars');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.listen(PORT, function () {
  console.log('Server listening on: http://localhost:' + PORT);
});