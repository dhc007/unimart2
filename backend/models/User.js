const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      default: function() {
        // Generate a username based on name or random string
        return 'user_' + Math.random().toString(36).substring(2, 10);
      }
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@pccegoa\.edu\.in$/, 'Please use a valid college email address']
    },
    password: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'Campus',
    },
    joinedDate: {
      type: Date,
      default: Date.now,
    },
    rating: {
      type: Number,
      default: 5.0,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    totalPurchases: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;