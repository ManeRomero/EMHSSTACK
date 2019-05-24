const {
    Router
} = require('express')
const router = Router()

const cloudinary = require('cloudinary')
const fs = require('fs-extra')
const passport = require('passport');

/* const nodemailer = require('nodemailer')
const xoauth2 = require('xoauth2')
const configMail = require('../config/configMail') */

const vivienda = require('../models/Vivienda')
const User = require('../models/User')
const Proceso = require('../models/procesos');
const Tarea = require('../models/tareas')

const {
    isAuthenticated,
    randomHash
} = require('../helpers/auth');

var entrada = Boolean

var crono = []
var cronoFin = []

let tituloWeb = ''

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLUDINARY_API_SECRET
})

/* GETS */

router.get('/', (req, res) => {
    const seccion = true
    const registro = true
    const acceso = true

    const tituloWeb = 'Te damos la bienvenida a la APP de Casa Fácil'
    res.render('intro', {
        tituloWeb,
        registro,
        acceso,
        seccion
    })
})

router.get('/signUp', (req, res) => {
    const registro = true
    const tituloWeb = 'Registro de usuario'
    res.render('user/signUp', {
        tituloWeb,
        registro
    })
})

router.get('/signIn', (req, res) => {
    const acceso = true
    const tituloWeb = 'Acceso de usuario'
    res.render('user/signIn', {
        tituloWeb,
        acceso
    })
})

router.get('/verInmuebles', isAuthenticated, async (req, res) => {
    const tituloWeb = 'Listado de Inmuebles'
    const seccion = true
    const lista = await vivienda.find()

    res.render('vistaViviendas', {
        lista,
        tituloWeb,
        seccion
    })
})

router.get('/listarInmuebles', isAuthenticated, async (req, res) => {
    const tituloWeb = 'Editar Inmuebles'
    const seccion = true
    const lista = await vivienda.find()
    res.render('listaInmuebles', {
        lista,
        tituloWeb,
        seccion
    })
})

router.get('/fichajeEntrada', isAuthenticated, (req, res) => {

    const fecha = new Date()
    const dia = fecha.getDate()
    const mes = fecha.getMonth() + 1
    const year = fecha.getFullYear()
    const hora = fecha.getHours()
    const minutos = fecha.getMinutes()
    crono.push(dia, mes, year, hora, minutos)

    entrada = true
    req.flash('success_msg', 'Has iniciado sesión a las ', crono[3], ':', crono[4])
    res.redirect('/panelControl')
})

router.get('/panelControl', isAuthenticated, (req, res) => {
    const fecha = new Date()

    const dia = fecha.getDate()

    tituloWeb = 'Panel de Control'

    res.cookie('date', dia)

    res.render('panelControl', {
        tituloWeb,
        entrada
    })
})

router.get('/subeInmueble', isAuthenticated, (req, res) => {
    tituloWeb = 'Sube un Inmueble'
    const seccion = true
    res.render('subirInmueble', {
        tituloWeb,
        seccion
    })
})

router.get('/calendario', isAuthenticated, (req, res) => {
    tituloWeb = 'Calendario de visitas'
    const seccion = true
    res.render('calendario', {
        tituloWeb,
        seccion
    })
})

router.get('/serAdmin', isAuthenticated, (req, res) => {
    const seccion = true
    tituloWeb = 'Cambiar tipo de Cuenta'
    res.render('user/formAdmin', {
        tituloWeb,
        seccion
    })
})

router.get('/logOut', (req, res) => {
    entrada = false

    const fecha = new Date()
    const dia = fecha.getDate()
    const mes = fecha.getMonth() + 1
    const year = fecha.getFullYear()
    const hora = fecha.getHours()
    var minutos = fecha.getMinutes()
    var tiempoSesion = '' /* [0]HORAS [1]MINUTOS */
    cronoFin.push(dia, mes, year, hora, minutos)

    if (cronoFin[3] > crono[3]) {

        if (cronoFin[4] < crono[4]) {

            var temp = cronoFin[3] - (crono[3] + 1)

            if (temp = 0) {
                tiempoSesion = 'CASO2: El tiempo de sesión ha sido de ' + (60 - crono[4] + cronoFin[4]) + ' minutos.'
            }

            if (temp > 0) {
                tiempoSesion = 'CASO3:El tiempo de sesión ha sido de ' + temp + ' horas, ' + (60 - crono[4] + cronoFin[4]) + ' minutos.'
            }
        }

        if (cronoFin[4] >= crono[4]) {
            var temp = cronoFin[3] - crono[3]
            tiempoSesion = 'CASO4:El tiempo de sesión ha sido de ' + temp + ' horas, ' + (cronoFin[4] - cronoFin[4]) + ' minutos.'
        }

    } else {
        if (cronoFin[3] = crono[3]) {
            tiempoSesion = 'CASO 1:El tiempo de sesión ha sido de ' + (cronoFin[4] - crono[4]) + ' minutos.'
        }
    }

    console.log(tiempoSesion)

    req.flash('success_msg', 'Te has desconectado. ', tiempoSesion, ' Hasta pronto!')
    req.logout()
    res.redirect('/')
})

router.get('/listaProcesos', isAuthenticated, async (req, res) => {
    const procesos = await Proceso.find({
        user: req.user.id
    }).sort({
        date: 'desc'
    })

    res.render('procesos/listaProcesos', {
        procesos
    })
})

router.get('/crearProceso', isAuthenticated, (req, res) => {
    res.render('procesos/nuevoProceso')
})

router.get('/listaProcesos/:_id/tareas', isAuthenticated, async (req, res) => {
    const proceso = await Proceso.findById(req.params._id)
    const consulta = await Tarea.find({
        proceso_id: req.params._id
    })
    console.log(proceso)
    res.render('procesos/tareasEnProceso', {
        consulta,
        proceso
    })
})


/* POSTS */

router.post('/subidaInmueble', isAuthenticated, async (req, res) => {
    var {
        titulo,
        descripcion,
        precio,
        referencia,
        tipoOperacion,
        tipoPropiedad,
        ciudad,
        zona,
        altura,
        superficie,
        antiguedad,
        estado,
        numPlantas,
        dormitorios,
        aseos,
        orientacion,
        parcela,
        terraza,
        vistas,
        suelo,
        ventanas,
        puertas,
        tipoPuertas,
        ascensor,
        otros
    } = req.body

    /*     const result = await cloudinary.v2.uploader.upload(req.files.path)
     */
    console.log('TODO ESTO ES GRACIAS A: ', process.env.AUTOR_WEB)

    const insert = new vivienda({
        titulo,
        descripcion,
        precio,
        referencia,
        tipoOperacion,
        tipoPropiedad,
        ciudad,
        zona,
        altura,
        superficie,
        antiguedad,
        estado,
        numPlantas,
        dormitorios,
        aseos,
        orientacion,
        parcela,
        terraza,
        vistas,
        suelo,
        ventanas,
        puertas,
        tipoPuertas,
        ascensor,
        otros,
        /* 
        imageURL: result.url,
        public_id: result.public_id
       */
    })

    const file = req.files[0];

    cloudinary.v2.uploader
        .upload_stream({
            resource_type: 'raw'
        }, (error, result) => {
            console.log(result)
        })
        .end(file.buffer);

    /*     for(var i = 0; i < req.files.length; i++){
            insert.fotos.push({
                public_id: result.public_id,
                imageURL: result.url
            })
        }
     */
    console.log('AÇO ES IMPUSIBLA ESTÁ OK!!')

    await insert.save()

    for (let index = 0; index < req.files.length; index++) {
        await fs.unlink(req.files[index].path)
    }

    req.flash('success_msg', 'Genial! Has publicado una nueva Vivienda.')
    res.redirect('/panelControl')
})

router.post('/signUp', async (req, res) => {
    let errors = [];
    const {
        name,
        email,
        password,
        conf_password
    } = req.body;

    if (password != conf_password) {
        errors.push({
            text: 'Las contraseñas no coinciden.'
        });
    }
    if (password.length < 4) {
        errors.push({
            text: 'La contraseña debe contener al menos 4 caracteres.'
        })
    }
    if (errors.length > 0) {
        res.render('user/signUp', {
            errors,
            name,
            email,
            password,
        })

    } else {

        console.log('SE REGISTRA USUARIO')

        const emailUser = await User.findOne({
            email: email
        });
        if (emailUser) {

            req.flash('error_msg', 'Este correo ya está en uso.');
            res.redirect('/signUp');

        } else {

            /* SI LLEGAMOS AQUÍ ES QUE TODO HA IDO BIEN,
            EMPEZAMOS CON EL ENVÍO DE MAIL PARA VERIFICACIÓN */

            console.log('EL HASH IMPORTADO CON EL QUE VAS A TRABAJAR ES ', randomHash)

            const newUser = new User({
                name,
                email,
                password,
                hashActivacion: randomHash
            });

            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'Registrado! Te damos la bienvenida al sistema.');
            res.redirect('/signIn');
        }
    }
})

router.post('/signIn', passport.authenticate('local', {
    successRedirect: '/panelControl',
    failureRedirect: '/signIn',
    failureFlash: true,
}));

router.put('/serAdmin/:id', isAuthenticated, async (req, res) => {
    const {
        passAdmin
    } = req.body
    if (passAdmin === 'tronchi') {
        const admin = true
        await User.findByIdAndUpdate(req.params.id, {
            admin
        })
        req.flash('success_msg', 'Genial! ADMIN: Ahora tienes acceso a todas las funciones.');
        res.redirect('/panelControl')

    } else {
        req.flash('error_msg', 'Contraseña de Admin incorrecta')
        res.redirect('/serAdmin')
    }
})

router.post('/crearProceso', isAuthenticated, async (req, res) => {
    const {
        referencia,
        nombreCliente,
        telefonoCliente,
        direccion,
        precioFinal
    } = req.body
    const tituloWeb = 'Nueva tarea'
    const errors = []

    if (!referencia) {
        errors.push({
            text: 'Por favor, escribe una descripción.'
        })
    }
    if (!nombreCliente, nombreCliente.length < 2) {
        errors.push({
            text: 'Debes introducir el nombre del cliente.'
        })
    }

    if (telefonoCliente.length < 8) {
        errors.push({
            text: 'El número de teléfono está mal introducido.'
        })
    }
    if (direccion.length < 8) {
        errors.push({
            text: 'La dirección que introduces no es suficientemente clara.'
        })
    }

    if (precioFinal.length < 2) {
        errors.push({
            text: 'El precio no está bien introducido.'
        })
    }

    if (errors.length > 0) {
        res.render('vistaProcesos/nuevoProceso', {
            errors,
            referencia,
            nombreCliente,
            telefonoCliente,
            direccion,
            tituloWeb,
            precioFinal
        })
    } else {
        /*     const user = req.user.name */
        const creadoPor = req.user.name
        const nuevoProceso = new Proceso({
            referencia,
            nombreCliente,
            telefonoCliente,
            direccion,
            creadoPor,
            precioFinal
        })
        nuevoProceso.user = req.user.id
        console.log('PROCESO GUARDADO POR ', creadoPor)
        await nuevoProceso.save()
        req.flash('success_msg', 'Proceso creado de manera satisfactoria.')
        res.redirect('/listaProcesos')
    }
})

router.post('/procesos/:_id/nuevaTarea', isAuthenticated, async (req, res) => {
    const nuevaTarea = new Tarea(req.body)
    nuevaTarea.proceso_id = req.params._id
    /*     console.log(nuevaTarea.proceso_id, ' ---- ', req.params._id, ' Y AQUÍ EL OBJETO', nuevaTarea) */
    nuevaTarea.creadoPor = req.user.name
    await nuevaTarea.save()
    req.flash('success_msg', 'Has añadido una Tarea al Proceso')
    res.redirect('/listaProcesos/' + nuevaTarea.proceso_id + '/tareas')
    /*   await nuevaTarea.save() */
})

/* PUT */

router.put('/serNoAdmin/:id', isAuthenticated, async (req, res) => {
    const admin = false
    await User.findByIdAndUpdate(req.params.id, {
        admin
    })
    req.flash('success_msg', 'Convertido a Usuario Stándard. Introduce la contraseña de nuevo para recuperar todas las opciones.')
    res.redirect('/panelControl')

})

/* DELETE */

router.get('/borraVivienda/:id', async (req, res) => {
    const {
        id
    } = req.params
    const borrado = await vivienda.findByIdAndRemove(id)
    const resultado = await cloudinary.v2.uploader.destroy(borrado.public_id)
    console.log(resultado)
    req.flash('success_msg', 'Vivienda eliminada de manera exitosa.')

    res.redirect('/listarInmuebles')
})

router.get('/borrarTarea/:id', async (req, res) => {
    const {
        id
    } = req.params
    const borrado = await Tarea.findByIdAndRemove(id)
    req.flash('success_msg', 'Tarea eliminada de manera exitosa.')
    res.redirect('/listaProcesos/:' + id + '/tareas')

})

module.exports = router