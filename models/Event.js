const { Schema, model } = require("mongoose");

const EventSchema = Schema({
    title: {
        type: String,
        required: true
    },

    notes:{
        type: String
    },

    start:{
        type: Date,
        required: true
    },

    end:{
        type: Date,
        required: true
    },

    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

EventSchema.method('toJSON', function(){//Para devolver la info en el controlador con el objeto modificado
    const { __v, _id, ...object } = this.toObject()
    object.id = _id
    return object
})

module.exports = model('Event', EventSchema)