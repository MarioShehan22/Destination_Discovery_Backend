import TourSchema from "../model/TourSchema.mjs";
import BookingSchema from "../model/BookingSchema.mjs";

const create = async (req, res) => {
    try {
        const { title, description, location, startDate, endDate, duration, price, maxParticipants, cancellationPolicy } = req.body;

        // Use req.body.id or a hardcoded ID for testing purposes
        const guideId = req.user?.id || req.body.id || "6437a99b2c7b2e001fc1e871"; // Example MongoDB ObjectId

        const tour = new TourSchema({
            title,
            description,
            location,
            startDate,
            endDate,
            duration,
            price,
            maxParticipants,
            guideId: guideId,
            cancellationPolicy,
            images: req.body.images || []
        });

        await tour.save();
        res.json(tour);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

const getAll = async (req,res)=>{
    try {
        const { location, date, expertise } = req.query;

        let query = {};
        if (location) query.location = new RegExp(location, 'i');
        if (date) {
            const searchDate = new Date(date);
            query.startDate = { $lte: searchDate };
            query.endDate = { $gte: searchDate };
        }

        let tours = await TourSchema.find(query).populate('guideId', 'firstName lastName expertise averageRating');

        // Additional filtering by guide expertise if provided
        if (expertise) {
            tours = tours.filter(tour =>
                    tour.guideId.expertise && tour.guideId.expertise.some(exp =>
                        exp.toLowerCase().includes(expertise.toLowerCase())
                    )
            );
        }

        res.json(tours);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
export {
    create
}
