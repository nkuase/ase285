import express from 'express';
import methodOverride from 'method-override';

// routes
import { createApiRouter } from './routes/api.js';
import { createRouter } from './routes/router.js';

// DB
import { db } from './util/db.js';

const PORT = process.env.PORT || 5500;

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
