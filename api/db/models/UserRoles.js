const mongose = require('mongoose');

const schema = mongose.Schema({
    role_id: {
        type: mongose.Schema.Types.ObjectId, required: true}, 
    user_id: {
        type: mongose.Schema.Types.ObjectId, required: true},
},{
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class UserRoles extends mongose.Model{

}

schema.loadClass(UserRoles);
module.exports = mongose.model('user_roles', schema);