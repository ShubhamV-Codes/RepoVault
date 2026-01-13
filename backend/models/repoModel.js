const mongoose = require('mongoose');
const {Schema} = mongoose;

// File schema for storing individual files
const FileSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String,
        default: "/"
    },
    content: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        default: "txt"
    },
    size: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const RepositorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    content: [
  {
    filename: { type: String, required: true },
    s3Key: { type: String, required: true },
    size: { type: Number },
    uploadedAt: { type: Date, default: Date.now }
  }
]
,  // Changed from String array to FileSchema array
    visibility: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    issues: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Issue'
        }
    ]
}, {
    timestamps: true  // Adds createdAt and updatedAt to Repository
});

const Repository = mongoose.model('Repository', RepositorySchema);

module.exports = Repository;