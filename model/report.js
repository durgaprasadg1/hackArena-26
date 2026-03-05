import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["daily", "weekly", "monthly", "90day"],
      required: true,
    },

    format: {
      type: String,
      enum: ["pdf", "csv"],
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    fileUrl: String, // Cloudinary URL or file path

    generatedAt: {
      type: Date,
      default: Date.now,
    },

    metadata: {
      totalPages: Number,
      fileSize: Number,
      downloadCount: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true },
);

// Indexes for efficient querying
ReportSchema.index({ userId: 1, type: 1, generatedAt: -1 });
ReportSchema.index({ generatedAt: -1 });

const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);

export default Report;
