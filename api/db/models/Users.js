const mongose = require('mongoose');

const schema = mongose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    isActive: {type: Boolean, default: true},
    first_name: String,
    last_name: String,
    phone_number: String
},{
    tinmestamps: {
        createdat: "created_at",
        updatedAt: "updated_at"
    }
});

class Users extends mongose.Model{

}

schema.loadClass(Users);
module.exports = mongose.model('users', schema);