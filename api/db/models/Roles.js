const mongose = require('mongoose');

const schema = mongose.Schema({
    role_name: {type: String, required: true},
    is_active: {type: Boolean, default: true},
    created_by: {
        type: mongose.Schema.Types.ObjectId,
        ref: 'Users'
    }
},{
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class Roles extends mongose.Model{

}

schema.loadClass(Roles);
module.exports = mongose.model('roles', schema);