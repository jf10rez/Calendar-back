const { response } = require("express");

const Event = require("../models/Event");

const getEvents = async( req, res = response ) => {

    try {

        const events = await Event.find({user: req.uid}).populate('user', 'name')
        
        res.status(200).json({
            ok: true,
            events
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: 'Se ha producido un error'
        })
    }
}

const updateEvent = async( req, res = response ) => {

    const eventId = req.params.id

    try {
        
        const event = await Event.findById( eventId )

        if( !event ){
            return res.status(404).json({
                ok: false,
                message: 'El evento no existe'
            })
        }

        if( event.user.toString() !== req.uid ){
            return res.status(401).json({
                ok: false,
                message: 'No tiene privilegios para modificar el evento'
            })
        }

        const newEvent = {
            ...req.body,
            user: req.uid
        }

        const eventUpdated = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } )

        res.status(200).json({
            ok: true,
            event: eventUpdated
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: 'Se produjo un error'
        })
    }
   
}

const newEvent = async( req, res = response ) => {

     const events = new Event( req.body )

     try {
        
        events.user = req.uid
        
        const eventSave = await events.save()

        res.status(201).json({
            ok: true,
            event: eventSave
        })

     } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: 'Por favor contacte al administrador'
        })
     }
}

const deleteEvent = async( req, res = response ) => {

    const eventId = req.params.id

    const event = await Event.findById( eventId )

        if( !event ){
            return res.status(404).json({
                ok: false,
                message: 'El evento no existe'
            })
        }

        if( event.user.toString() !== req.uid ){
            return res.status(401).json({
                ok: false,
                message: 'No tiene privilegios para eliminar el evento'
            })
        }

        await Event.findByIdAndDelete( eventId )

        res.status(200).json({
            ok: true
        })
}

module.exports = {
    getEvents,
    updateEvent,
    newEvent,
    deleteEvent
}