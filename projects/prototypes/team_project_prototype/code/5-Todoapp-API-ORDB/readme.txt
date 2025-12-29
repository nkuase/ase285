## Running Application

### Step 1: Copy .env.example to .env
```bash
cp env .env
```

### Step 2: Edit .env to choose database
```bash
# In project root: .env
DB_TYPE=sqlite    # or mongodb
```

### Step 3: Start server
```bash
npm install
npm start
```

**Database is automatically selected!**
