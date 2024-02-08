const ID=''; 
const PASSWORD = ''; 
const NET='';

// Connection URI
const uri = `mongodb+srv://${ID}:${PASSWORD}@${NET}/?retryWrites=true&w=majority`

module.exports = uri