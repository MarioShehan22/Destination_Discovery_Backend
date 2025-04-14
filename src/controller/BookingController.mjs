import TourSchema from "../model/TourSchema.mjs";
import BookingSchema from "../model/BookingSchema.mjs";

const create = async (req,res)=>{
    try {
        const { tourId, participantCount, specialRequests } = req.body;

        // Get tour information
        const tour = await TourSchema.findById(tourId);
        if (!tour) return res.status(404).json({ message: 'Tour not found' });

        // Check availability
        if (tour.currentParticipants + participantCount > tour.maxParticipants) {
            return res.status(400).json({ message: 'Not enough spots available' });
        }

        // Calculate total price
        const totalPrice = tour?.price * participantCount;

        const booking = new BookingSchema({
            tourId,
            // touristId: req.user.id,
            touristId: "67e3f4ca2cf54dd878d08d8c",
            participantCount,
            totalPrice,
            specialRequests: specialRequests || ''
        });

        // Update tour participant count
        tour.currentParticipants += participantCount;
        await tour.save();

        await booking.save();

        // Send confirmation email
        // Implementation with nodemailer

        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
const findAll = async (req,res)=>{
    try {

        const tour = await BookingSchema.find();
        if (!tour) return res.status(404).json({ message: 'No Tour Data' });
        const count = await BookingSchema.countDocuments();

        res.status(200).json({message:"data list",dataCount:count,data:tour});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
export {
    create,
    findAll
}
