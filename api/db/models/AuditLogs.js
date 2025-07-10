const mongose = require('mongoose');

const schema = mongose.Schema({
    level: String,
    email: String,
    location: String,
    proc_type: String,
    log: mongose.SchemaTypes.Mixed
},{
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class AuditLogs extends mongose.Model{

}

schema.loadClass(AuditLogs);
module.exports = mongose.model('audit_logs', schema);