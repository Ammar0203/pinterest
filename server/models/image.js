const { Schema, model } = require('mongoose');

const imageSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 28,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  likes: {
    type: Number,
    default: 0,
  }
});

imageSchema.statics.getSample = async function getRandomSample(excludeIds = [], sampleSize = 36) {
  try {
    // Initialize an empty array to store the final sample
    let finalSample = [];

    // Continue fetching samples until we have the desired sample size
    while (finalSample.length < sampleSize) {
      // Calculate the required sample size in each iteration
      const requiredSampleSize = sampleSize - finalSample.length;

      // Perform the aggregation to get a random sample
      const pipeline = [
        { $match: { _id: { $nin: excludeIds } } },
        { $sample: { size: requiredSampleSize } }
      ];

      const randomSample = await this.aggregate(pipeline).exec();

      // Add the new sample to the final sample array
      finalSample = finalSample.concat(randomSample);

      // Update the excludeIds array with the IDs of the newly sampled documents
      excludeIds = excludeIds.concat(randomSample.map(doc => doc._id));

      // Break the loop if no more documents are available to sample
      if (randomSample.length < requiredSampleSize) {
        break;
      }
    }

    return finalSample;
  } catch (err) {
    console.error(err);
    return [];
  }
}

const Image = model("Image", imageSchema);

module.exports = Image;