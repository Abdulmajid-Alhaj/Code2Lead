import mongoose from 'mongoose';

const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateUsername = username => /^[a-zA-Z0-9_]+$/.test(username);
const validatePassword = password => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/.test(password);

const userSchema = new mongoose.Schema(
  {
    // User's name or display name
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

    // Unique email used for login and identification
    email: {
      type: String,
      required: true, // must be provided
      unique: true,   // no duplicate emails allowed
      trim: true,     // remove whitespace
      lowercase: true, // store in lowercase for consistency
      validate: {
        validator: validateEmail,
        message: 'Please provide a valid email address'
      }
    },

    // Hashed password will be stored here (hashing happens elsewhere)
    passwordHash: {
      type: String,
      required: true,
      validate: {
        validator: validatePassword,
        message: 'Password must include uppercase, lowercase, and a number'
      }
    },

    // User role in the system
    role: {
      type: String,
      enum: ['admin', 'trainer', 'student'], // only allowed values
      default: 'student'
    },

    // Link to the user's avatar image
    avatar: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: v => !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v),
        message: 'Avatar must be a valid image URL'
      }
    },

    // Short biography or user description
    bio: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ''
    },

    // Determines whether the user's profile is publicly visible or private
    publicProfile: {
      type: Boolean,
      default: true 
    },

  },

  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);
export default User;
