import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent',
    required: [true, 'Parent reference is required'],
  },
  daycare: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Daycare',
    required: [true, 'Daycare reference is required'],
  },
  child: {
    name: {
      type: String,
      required: [true, 'Child name is required'],
    },
    age: {
      type: Number,
      required: [true, 'Child age is required'],
    },
    specialNeeds: {
      type: String,
      default: '',
    },
    allergies: {
      type: String,
      default: '',
    },
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  schedule: {
    type: String,
    required: [true, 'Schedule details are required'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
bookingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking; 