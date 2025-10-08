const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateUsername = username => /^[a-zA-Z0-9_]+$/.test(username);
const validatePassword = password => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/.test(password);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
    validate: {
      validator: v => /^[a-zA-Z\s]+$/.test(v),
      message: 'Name can only contain letters and spaces'
    }
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 30,
    validate: {
      validator: validateUsername,
      message: 'Username can only contain letters, numbers, and underscores'
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: validateEmail,
      message: 'Please provide a valid email address'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    validate: {
      validator: validatePassword,
      message: 'Password must include uppercase, lowercase, and a number'
    }
  },
  role: {
    type: String,
    enum: ['user', 'trainer', 'admin'],
    default: 'user'
  },
  bio: { type: String, trim: true, maxlength: 1000, default: '' },
  avatar: {
    type: String,
    trim: true,
    default: '',
    validate: {
      validator: v => !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v),
      message: 'Avatar must be a valid image URL'
    }
  },
  publicProfile: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null },
}, { timestamps: true });

// Password hash
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Safe data
userSchema.methods.getSafeData = function() {
  return {
    id: this._id,
    name: this.name,
    username: this.username,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
    bio: this.bio,
    publicProfile: this.publicProfile,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);
