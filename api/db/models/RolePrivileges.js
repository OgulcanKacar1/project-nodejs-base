const mongose = require('mongoose');

const schema = mongose.Schema({
    role_id: {
        type: mongose.Schema.Types.ObjectId, required: true}, 
    permission: {type: String, required: true},
    created_by: {
        type: mongose.Schema.Types.ObjectId},
},{
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class RolePrivileges extends mongose.Model{

}

schema.loadClass(RolePrivileges);
module.exports = mongose.model('role_privileges', schema);