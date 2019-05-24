const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
})

.then(db => console.log('BASE DE DATOS CONECTADA'))
.catch(err => console.error(err))