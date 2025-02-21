import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const daycareSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Daycare name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  city: {
    type: String,
    required: [true, 'City is required'],
  },
  state: {
    type: String,
    required: [true, 'State is required'],
  },
  zipCode: {
    type: String,
    required: [true, 'ZIP code is required'],
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  operatingHours: {
    type: String,
    required: [true, 'Operating hours are required'],
  },
  ageRange: {
    type: String,
    required: [true, 'Age range is required'],
  },
  licensingInfo: {
    type: String,
    required: [true, 'Licensing information is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
});

// Hash password before saving
daycareSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
daycareSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Daycare = mongoose.models.Daycare || mongoose.model('Daycare', daycareSchema);

export default Daycare; 