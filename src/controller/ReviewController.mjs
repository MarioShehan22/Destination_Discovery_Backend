import BookingSchema from "../model/BookingSchema.mjs";
import TourSchema from "../model/TourSchema.mjs";
import ReviewSchema from "../model/ReviewSchema.mjs";
import UserSchema from "../model/UserSchema.mjs";

const create = async (req,res)=>{
    try {
        const { tourId, rating, comment } = req.body;

        // Verify that the user actually booked this tour
        const booking = await BookingSchema.findOne({
            tourId,
            touristId: req.user.id,
            status: { $in: ['confirmed', 'completed'] }
        });

        if (!booking) return res.status(400).json({ message: 'You must book and complete this tour before reviewing' });

        // Get the guide ID from the tour
        const tour = await TourSchema.findById(tourId);
        if (!tour) return res.status(404).json({ message: 'Tour not found' });

        const review = new ReviewSchema({
            tourId,
            guideId: tour.guideId,
            touristId: req.user.id,
            rating,
            comment,
            verified: true // Since we verified the booking
        });

        await review.save();

        // Update guide's average rating
        const allGuideReviews = await ReviewSchema.find({ guideId: tour.guideId });
        const avgRating = allGuideReviews.reduce((sum, review) => sum + review.rating, 0) / allGuideReviews.length;

        await UserSchema.findByIdAndUpdate(tour.guideId, { averageRating: avgRating });

        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

export {
    create
}

