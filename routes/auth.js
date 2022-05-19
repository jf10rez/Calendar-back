// Rutas de usuarios:

// Host + /api/auth

const { Router } = require('express')
const router = Router()
const { check } = require('express-validator')

const { createUser, loginUser, revalidateToken } = require('../controllers/authController')
const { validarCampos } = require('../middlewares/validar-campos')
const { validateJWT } = require('../middlewares/validate-jwt')

router.post(
    '/new', 
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe contener minimo 6 caractéres').isLength({min: 6}),
        validarCampos
    ],
    createUser)

router.post(
    '/',
    [ check('email', 'El email es obligatorio').isEmail(),
      check('password', 'La contraseña es obligatoria').not().isEmpty(),
      validarCampos
    ],
    loginUser)


router.get('/renew', validateJWT , revalidateToken)

module.exports = router
