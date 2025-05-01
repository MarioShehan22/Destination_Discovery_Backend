import TourSchema from "../model/TourSchema.mjs";

const create = async (req, res) => {
    try {
        const tourSchema = new TourSchema(req.body);
        await tourSchema.save();
        res.status(201).send({"message": "Tour Save successfully"});
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

const findAll = async (req,res)=>{
    try {
        const tour = await TourSchema.find();
        if (!tour) return res.status(404).json({ message: 'No Tour Data' });
        const count = await TourSchema.countDocuments();

        res.status(200).json({message:"data list",dataCount:count,data:tour});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

const updateTourStatus = async (req,res)=>{
    try {
        const {id} = req.params;
        const {status}= req.body;
        if(!['Active', 'Completed', 'Cancelled'].includes(status)){
            return res.status(400).json({message:"invalid tour status",data:null});
        }

        const updatedOrder = await TourSchema.findByIdAndUpdate(
            id,{status},{new:true,}
        );
        if(updatedOrder){
            return res.status(201).json({message:"tour updated",data:updatedOrder});
        }
        res.status(404).json({message:"tour not found!"});
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
}


const findById = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) {
            return res.status(400).json({code: 400, message: 'tour id is missing!..', data: null});
        }
        const Data =
            await TourSchema.findById({'_id': req.params.id});
        if (Data) {
            return res.status(200).json({code: 200, message: 'tour data...', data: Data});
        }
        return res.status(404).json({code: 404, message: 'tour data not found...', data: null});
    } catch (e) {
        res.status(500).json({code: 500, message: 'something went wrong...', error: e});
    }
}
const findByGuideId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ code: 400, message: 'guide id is missing!..', data: null });
        }
        // Use findOne and query by guideId
        const Data = await TourSchema.find({ guideId: id });
        if (Data) {
            return res.status(200).json({ code: 200, message: 'tour data...', data: Data });
        }
        return res.status(404).json({ code: 404, message: 'tour data not found...', data: null });
    } catch (e) {
        res.status(500).json({ code: 500, message: 'something went wrong...', error: e });
    }
}

export {
    create,
    getAll,
    updateTourStatus,
    findAll,
    findById,
    findByGuideId
}
