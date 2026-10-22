# Step 2: Todo App with Mongoose (ODM)

**Goal**: the same features as step 1, with a data modeling layer (Mongoose ODM).

## Run

```bash
./run.sh            # needs code/.env (copy ../.env.example); http://localhost:5500
```

## What is new

| File | What it does |
|------|--------------|
| `models/Post.js` | schema of a post (types and `required` validation) and the `Post` model |
| `models/Counter.js` | schema of the auto-increment counter |
| `util/util.js` | `getNextId()` with `Counter.findByIdAndUpdate` |
| `index.js` | `mongoose.connect(uri, { dbName })` and the model methods instead of raw queries |

## Native driver vs Mongoose

| Native driver (step 1) | Mongoose (step 2) |
|------------------------|-------------------|
| `posts.insertOne({...})` | `new Post({...}).save()` |
| `posts.find().toArray()` | `Post.find({})` |
| `posts.findOne({ _id: id })` | `Post.findById(id)` |
| `posts.updateOne({ _id }, { $set: {...} })` | `Post.findByIdAndUpdate(id, {...})` |
| `posts.deleteOne({ _id })` | `Post.findByIdAndDelete(id)` |

## Key ideas

- **Schema**: one place that defines the structure and the validation of the data.
- **Validation**: a missing title or date makes `save()` fail with a `ValidationError` (the server answers 400).
- **`runValidators: true`**: updates are validated too (by default only `save()` is).
- **`lean()`**: plain JavaScript objects instead of Mongoose documents (enough for the templates).

## Try it

- Remove `required` from the form inputs and submit an empty form: Mongoose rejects it.
