// Rutas de usuarios:

// Host + /api/events

const { Router } = require('express')
const router = Router()
const { check } = require('express-validator')

const { isDate } = require('../helpers/isDate')
const { getEvents, updateEvent, newEvent, deleteEvent } = require('../controllers/eventsController')
const { validarCampos } = require('../middlewares/validar-campos')
const { validateJWT } = require('../middlewares/validate-jwt')

//Todos los endpoints pasan por este middleware
router.use( validateJWT )

router.get('/', getEvents )

router.put(
    '/:id', 
    [
        check('title', 'El title es obligatorio').not().isEmpty(),
        check('start', 'Fecha inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha fin es obligatoria').custom( isDate ),
        validarCampos
    ] , 
    updateEvent)

router.post( 
    '/', 
    [
        check('title', 'El title es obligatorio').not().isEmpty(),
        check('start', 'Fecha inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha fin es obligatoria').custom( isDate ),
        validarCampos
    ],
    newEvent)

router.delete('/:id', deleteEvent)




module.exports = router