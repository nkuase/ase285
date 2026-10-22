import express from 'express';
import methodOverride from 'method-override';

// utils
import uri from './util/uri.js';
import { connect } from './util/db.js';

// routes
import { createApiRouter } from './routes/api.js';
import { createRouter } from './routes/router.js';

const PORT = process.env.PORT || 5500;

// DB
const db = await connect(uri); // top-level await is OK

// APP
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true })); // HTML forms and jQuery ajax (key=value)
app.use(express.json()); // JSON bodies: needed by the REST API (curl, fetch, ...)
app.use(methodOverride('_method')); // <form action="/edit?_method=PUT"> becomes PUT /edit

app.use('/public', express.static('public'));
app.use('/api', createApiRouter(db)); // REST API:  /api/posts ...
app.use('/', createRouter(db)); // Web UI:    /, /list, /add ...

// Start the Server
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
