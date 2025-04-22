const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EngagementSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tiktokUserId: {
    type: String,
    required: true
  },
  contentId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['like', 'comment', 'view', 'fyp_appearance'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for efficient queries
EngagementSchema.index({ user: 1, tiktokUserId: 1 });
EngagementSchema.index({ user: 1, timestamp: -1 });
EngagementSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model('Engagement', EngagementSchema);
