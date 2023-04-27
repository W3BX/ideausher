const mongoose = require('mongoose');

const uri = 'mongodb+srv://user1:erjjYzxXY3hHO7JF@cluster0.g728sqv.mongodb.net/ideaUshare?retryWrites=true&w=majority'
//const uriLocal = 'mongodb://localhost:27017/backend'
//connect to mongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});

module.exports = mongoose.connection