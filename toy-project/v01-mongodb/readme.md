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

2. Run `npm install` to install modules. If you need to update the modules to the latest one, read the tip `How to update node packages to the latest?` in `Canvas Course Tools and Resources` page. (If you can’t find the info in Canvas , contact the professor.)

3. Copy the mongodbuitl.js from the ../crud directory if the file is not in the current directory. 