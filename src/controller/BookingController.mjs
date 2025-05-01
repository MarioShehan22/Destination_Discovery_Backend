import TourSchema from "../model/TourSchema.mjs";
import BookingSchema from "../model/BookingSchema.mjs";
import Booking from "../model/BookingSchema.mjs";
import mongoose from "mongoose";

const create = async (req,res)=>{
    try {
        const { tourId, participantCount, specialRequests,touristId } = req.body;

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
            touristId: touristId,
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
        const {page = 1, size = 10} = req.query;
        const pageIndex = parseInt(page);
        const pageSize = parseInt(size);

        const skip = (pageIndex - 1) * pageSize;

        const booking = await BookingSchema.find()
            .limit(pageSize)
            .skip(skip);

        if (!booking) return res.status(404).json({ message: 'No Tour Data' });
        const count = await BookingSchema.countDocuments();

        res.status(200).json({code: 200,message:"data list",dataCount:count,data:booking});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

const findById = async (req,res)=>{
    try {
        if (!req.params.id) {
            return res.status(400).json({code: 400, message: 'booking id is missing!..', data: null});
        }
        const bookingData =
            await BookingSchema.findById({'_id': req.params.id});
        if (bookingData) {
            return res.status(200).json({code: 200, message: 'booking data...', data: bookingData});
        }
        return res.status(404).json({code: 404, message: 'booking data data not found...', data: null});
    } catch (e) {
        res.status(500).json({code: 500, message: 'something went wrong...', error: e});
    }
}

const updateBookingStatus = async (req,res)=>{
    try {
        const {id} = req.params;
        const {status}= req.body;
        if(!["PENDING","REJECTED","COMPLETED","CANCELLED"].includes(status)){
            return res.status(400).json({message:"invalid booking status",data:null});
        }
        if(status === "REJECTED"||status === "CANCELLED"){
            const selectedBooking = await BookingSchema.findById(id);
            const tour = await TourSchema.findById({_id:selectedBooking.tourId});
            if (!tour) return res.status(404).json({ message: 'Tour not found' });
            tour.currentParticipants -= selectedBooking.participantCount;
            await tour.save();
        }
        const updatedOrder = await BookingSchema.findByIdAndUpdate(
            id,{status},{new:true,}
        );
        if(updatedOrder){
            return res.status(201).json({message:"booking updated",data:updatedOrder});
        }
        res.status(404).json({message:"booking not found!"});
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

const updateBookingPaymentStatus = async (req,res)=>{
    try {
        const {id} = req.params;
        const {paymentStatus}= req.body;
        if(!['PENDING', 'COMPLETED', 'REFUNDED'].includes(paymentStatus)){
            return res.status(400).json({message:"invalid payment booking status",data:null});
        }

        const updatedOrder = await BookingSchema.findByIdAndUpdate(
            id,{paymentStatus},{new:true,}
        );
        if(updatedOrder){
            return res.status(201).json({message:"booking updated",data:updatedOrder});
        }
        res.status(404).json({message:"booking not found!"});
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

const getBookingsForGuide = async (req, res) => {
    try {
        const guideId = req.params.guideId;
        console.log(guideId);
        if (!mongoose.Types.ObjectId.isValid(guideId)) {
            return res.status(400).json({ code: 400, message: "Invalid guideId", data: null });
        }

        // Find all tours for this guide
        //const tours = await Tour.find({ guideId }).select("_id");
       // const tourIds = tours.map(t => t._id);

        // Find all bookings for these tours
        // const bookings = await Booking.find({ tourId: { $in: tourIds } })
        //     .populate("tourId")
        //     .populate("touristId");

        const bookings = await Booking.find({'guideId': guideId})

        res.status(200).json({ code: 200, message: "Success", data: bookings });
    } catch (error) {
        res.status(500).json({ code: 500, message: "Server error", error });
    }
};
export {
    create,
    findAll,
    updateBookingStatus,
    updateBookingPaymentStatus,
    findById,
    getBookingsForGuide
}
