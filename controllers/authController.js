const { response } = require("express");
const bcrypt = require('bcryptjs');

const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");

//POST: /new
const createUser = async( req, res = response ) => {

    const { email, password } = req.body

    try {

        //Buscar si existe un usuario con ese correo
        let user = await User.findOne({email})

        if( user ){
            return res.status(400).json({
                ok: false,
                message: `El usuario con correo ${email} ya existe`
            })
        }
        
        user = new User( req.body )

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt )
    
        await user.save()

        //Generar JWT
        const token = await generateJWT( user.id, user.name )

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Contacte al admin'
        })
    }

}

//POST: /
const loginUser = async( req, res ) => {

    try {
        
        const { email, password } = req.body

        //Buscar si existe un usuario con ese correo
        let user = await User.findOne({email})

        if( !user ){
            return res.status(400).json({
                ok: false,
                message: `El correo ingresado no existe`
            })
        }

        //Confirmar password
        const validPassword = bcrypt.compareSync( password, user.password )

        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                message: 'La contraseña no es correcta'
            })
        }

        //Generar JWT
        const token = await generateJWT( user.id, user.name )
    
        res.status(200).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: 'Se ha producido un error, contacte al admin'
        })
    }

}

//GET: /renew
const revalidateToken = async( req, res ) => {

    const uid = req.uid
    const name = req.name

    //Generar JWT
    const token = await generateJWT( uid, name )

    res.status(200).json({
        ok: true,
        token
    })
    
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken
}