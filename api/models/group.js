const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    tags: [
      {
        type: String,
      },
    ],
    survey: [{ type: mongoose.Schema.Types.ObjectId, ref: 'survey' }],
  },
  { timestamps: true },
);

const Group = mongoose.model('group', groupSchema);
module.exports = Group;
