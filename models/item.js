var mongoose = require('mongoose');

var ItemSchema = mongoose.Schema({
    itemname: {
        type: String
    },
    dateAdded: {
        type: String,
        index: true
    },
    addedBy: {
        type: String
    },
    users: {
        type: [String]
    },
    category: {
        type: String
    },
    retrieved: {
        type: Boolean
    }
});

module.exports = mongoose.model('Item', ItemSchema);
