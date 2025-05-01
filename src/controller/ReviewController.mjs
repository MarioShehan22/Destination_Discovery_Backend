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

const findAll = async (req, res) => {
    try {
        //find all review using ReviewSchema
        const review = await ReviewSchema.find();
        //If review data is not returned
        if (!review) return res.status(404).json({ message: 'No review found' });
        //Count number of review data
        const count = await ReviewSchema.countDocuments();

        res.status(200).json({message:"review data list",dataCount:count,data:review});
    }catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

const remove = async (req,res)=>{
    try {
        const reviewId = req.params.id;
        if (!reviewId) return res.status(404).json({ message: 'No review id provide' });
        const temp = await ReviewSchema.deleteOne({_id: userId});
        res.status(204).json({message:"review was delete",data:temp});
    }catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
export {
    create,
    remove,
    findAll,
}

