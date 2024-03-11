const express = require('express');
require('express-async-errors');
const methodOverride = require('method-override');
const { engine } = require('express-handlebars');
const { handleError } = require('./utils/errors');
const { homeRouter } = require('./routers/home');
const { childRouter } = require('./routers/child');
const { giftRouter } = require('./routers/gift');
require('./utils/db');
const { handlebarsHelpers } = require('./utils/handlebarsHelpers');

const PORT = 3000;
const app = express();

app.use(methodOverride('_method'));
app.use(express.urlencoded({
  extended: true,
}));

app.use(express.static('./public'));
// app.use(express.json()); // Content-type: application/json

app.engine('.hbs', engine({
  extname: '.hbs',
  helpers: handlebarsHelpers, // dodatkowe funkcjonalności do hbs
}));
app.set('view engine', '.hbs');

app.use('/', homeRouter);
app.use('/child', childRouter);
app.use('/gift', giftRouter);
//
// (async () => {
//   const user = await ChildRecord.getOne('ac851b0e-946f-4cb7-937e-d8e3d06c25d6');
//   console.log(user);
// })();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(handleError);

app.listen(PORT, 'localhost', () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
