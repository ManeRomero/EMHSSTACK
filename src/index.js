if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
} else {
    /*  */
}

const app = require('./app')

app.listen(app.get('port'), () => {
    console.log('SERVIDOR OKAY! PUERTO #', app.get('port'))
})
