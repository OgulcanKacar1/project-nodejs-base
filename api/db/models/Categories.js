const mongose = require('mongoose');

const schema = mongose.Schema({
    is_active: {type: Boolean, default: true},
    created_by: {
        type: mongose.Schema.Types.ObjectId, required: true
    }
},{
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class Categories extends mongose.Model{

}

schema.loadClass(Categories);
module.exports = mongose.model('categories', schema);