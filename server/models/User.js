import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AddressSchema = new mongoose.Schema({
  street: { type: String },
  city: { type: String },
  province: { type: String },
  country: { type: String, default: "Pakistan" },
  postalCode: { type: String },
}, { _id: false });

const UserSchema = new mongoose.Schema(
  {
    // Authentication
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: { type: String, required: true, minlength: 8, select: false },
    passwordChangedAt: { type: Date },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },

    // Role & Permissions
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },
    permissions: {
      type: [String],
      default: [],
      enum: [
        "tours:read", "tours:write", "tours:delete",
        "hotels:read", "hotels:write", "hotels:delete",
        "bookings:read", "bookings:write", "bookings:delete", "bookings:refund",
        "users:read", "users:write", "users:delete",
        "reviews:read", "reviews:write", "reviews:delete",
        "reports:read", "settings:write",
      ],
    },

    // Profile
    phone: { type: String, trim: true },
    avatar: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    address: { type: AddressSchema },

    // Emergency Contact
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      relationship: { type: String },
    },

    // Travel Preferences
    preferredPickup: {
      type: String,
      enum: ["Islamabad", "Abbottabad", null],
      default: null,
    },
    dietaryRequirements: { type: [String], default: [] },
    interests: { type: [String], default: [] },

    // Account Status
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    lastLoginAt: { type: Date },
    loginCount: { type: Number, default: 0 },

    // JWT
    refreshToken: { type: String, select: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ createdAt: -1 });

// Virtual: full name
UserSchema.virtual("displayName").get(function () {
  return this.name;
});

// Pre-save: hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }
  next();
});

// Method: compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method: check if password changed after JWT issued
UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Method: check permission
UserSchema.methods.hasPermission = function (permission) {
  if (this.role === "super_admin") return true;
  return this.permissions.includes(permission);
};

// Method: check if admin
UserSchema.methods.isAdmin = function () {
  return this.role === "admin" || this.role === "super_admin";
};

const User = mongoose.model("User", UserSchema);
export default User;
