## Instruction

1. Create a file `_config.js` with the following content. Be sure to fill in the ID/PASSWORD and NET information. 

```
const ID=''; 
const PASSWORD = ''; 
const NET=''; 

// Connection URI
const URI = `mongodb+srv://${ID}:${PASSWORD}@${NET}/?retryWrites=true&w=majority`

module.exports.URI = URI
```

2. Make todoapp database that has posts and counter collections. 
