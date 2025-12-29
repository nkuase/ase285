
---

- Simple deployment process

## Common Patterns

### Pattern 1: Separate API Prefix

```javascript
// All API routes under /api
app.get('/api/users', ...)
app.post('/api/login', ...)

// React handles everything else
app.get('*', (req, res) => {
  res.sendFile('index.html');
});
```

### Pattern 2: API Version Control

```javascript
// Version your API
app.use('/api/v1', apiV1Router);
app.use('/api/v2', apiV2Router);

// React Router
app.get('*', sendIndexHtml);
```

### Pattern 3: Middleware Chain

```javascript
app.use(express.json());           // Parse JSON
app.use(express.static(build));    // Serve static
app.use('/api', requireAuth);      // Protect API
app.use('/api', apiRouter);        // API routes
app.get('*', sendIndexHtml);       // SPA fallback
```

## Security Considerations

```javascript
// 1. Helmet for security headers
const helmet = require('helmet');
app.use(helmet());

// 2. CORS for API access
const cors = require('cors');
app.use('/api', cors({
  origin: 'https://yourdomain.com'
}));

// 3. Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// 4. Environment variables
require('dotenv').config();
// Never commit .env file!
```

---
