import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';

// routes
import { createApiRouter } from './routes/api.js';
import { createRouter } from './routes/router.js';

// DB
import { db } from './util/db.js';

// APP
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use('/public', express.static('public'));
app.use('/api', createApiRouter(db));
app.use('/', createRouter(db));

// Start the Server
app.listen(5500, function () {
  console.log('listening on 5500')
});
