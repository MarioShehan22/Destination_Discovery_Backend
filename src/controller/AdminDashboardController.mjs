import UserSchema from "../model/UserSchema.mjs";
import TourSchema from "../model/TourSchema.mjs";
import BookingSchema from "../model/BookingSchema.mjs";

const getDetail = async (req,res)=>{
    try {
        const totalUsers = await UserSchema.countDocuments();
        const totalTourists = await UserSchema.countDocuments({ userType: 'Tourist' });
        const totalGuides = await UserSchema.countDocuments({ userType: 'Guide' });
        const totalTours = await TourSchema.countDocuments();
        const totalBookings = await BookingSchema.countDocuments();

        // Revenue stats
        const bookings = await BookingSchema.find({ paymentStatus: 'completed' });
        const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

        // Popular tours
        const popularTours = await TourSchema.aggregate([
            { $lookup: { from: 'bookings', localField: '_id', foreignField: 'tourId', as: 'bookings' } },
            { $addFields: { bookingCount: { $size: '$bookings' } } },
            { $sort: { bookingCount: -1 } },
            { $limit: 5 }
        ]);

        // Top-rated guides
        const topGuides = await UserSchema.find({ userType: 'Guide' })
            .sort({ averageRating: -1 })
            .limit(5)
            .select('firstName lastName averageRating');

        res.json({
            userStats: { totalUsers, totalTourists, totalGuides },
            tourStats: { totalTours },
            bookingStats: { totalBookings, totalRevenue },
            popularTours,
            topGuides
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
export {
    getDetail
}
