const mongose = require('mongoose');
const { PASS_LENGTH, HTTP_CODES } = require('../../config/Enum');
const CustomError = require('../../lib/Error');
const is = require("is_js");
const bcrypt = require('bcrypt-nodejs');
const {DEFAULT_LANG} = require('../../config');

const schema = mongose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isActive: {type: Boolean, default: true},
    first_name: String,
    last_name: String,
    phone_number: String,
    language: {type: String, default: DEFAULT_LANG}
},{
    versionKey: false,
    tinmestamps: {
        createdat: "created_at",
        updatedAt: "updated_at"
    }
});

class Users extends mongose.Model{

    validPassword(password){
        return bcrypt.compareSync(password, this.password);
    }

    static validateFieldsBeforeAuth(email, password){
        if(typeof password !== "string" || password.length < PASS_LENGTH || is.not.email(email))
            throw new CustomError(HTTP_CODES.UNAUTHORIZED, "Validation Error", "email or password wrong");

        return null;
    }

}

schema.loadClass(Users);
module.exports = mongose.model('users', schema);