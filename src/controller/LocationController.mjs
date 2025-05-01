import LocationSchema from "../model/LocationSchema.mjs";

const create = async (req,res)=>{
    try{

        const guide = new LocationSchema(req.body);
        await guide.save();
        res.status(201).send({"message": "location Save successfully"});
    }catch(err){
        console.log(err);
        res.status(500).send('Server error');
    }
}

const update = async (req, res) => {
    try {
        const {locationName,temperature,description,type,accessibility_info,best_visit_time,facilities,is_active,to,image} = req.body;
        if (!locationName || !temperature || !description|| !type|| !accessibility_info|| !best_visit_time|| !facilities|| !is_active|| !to||image) {
            return res.status(400).json({code: 400, message: 'some fields are missing!..', data: null});
        }
        const updateData = await LocationSchema.findOneAndUpdate({'_id': req.params.id}, {
            $set: {
                locationName: locationName,
                temperature: temperature,
                description: description,
                type: type,
                accessibility_info: accessibility_info,
                best_visit_time: best_visit_time,
                facilities: facilities,
                to:to,
                image:image,
                is_active: is_active,
            }
        }, {new: true});
        return res.status(200).json({code: 200, message: 'Location record has been updated...', data: updateData});
    } catch (e) {
        res.status(500).json({code: 500, message: 'something went wrong...', error: e});
    }
}

const findAll = async (req, res) => {
    try {
        const {page = 1, size = 10} = req.query;
        const pageIndex = parseInt(page);
        const pageSize = parseInt(size);

        const skip = (pageIndex - 1) * pageSize;
        const DataList = await LocationSchema.find()
            .limit(pageSize)
            .skip(skip);
        const DataListCount = await LocationSchema.countDocuments();

        return res.status(200).json({
            code: 200,
            message: 'location data data...',
            data: {data: DataList, dataCount: DataListCount}
        });
    } catch (e) {
        res.status(500).json({code: 500, message: 'something went wrong...', error: e});
    }
}

const findById = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({code: 400, message: 'location id is missing!..', data: null});
        }
        const Data =
            await LocationSchema.findById({'_id': req.params.id});
        if (Data) {
            return res.status(200).json({code: 200, message: 'location data...', data: Data});
        }
        return res.status(404).json({code: 404, message: 'location data not found...', data: null});
    } catch (e) {
        res.status(500).json({code: 500, message: 'something went wrong...', error: e});
    }
}

const deleteLocation = async (request, response) => {
    try {
        if (!request.params.id) {
            return response.status(400).json({code: 400, message: 'location id is missing!..', data: null});
        }
        const deletedData =
            await LocationSchema.findOneAndDelete({'_id': request.params.id});
        return response.status(204).json({
            code: 204,
            message: 'location record has been deleted...',
            data: deletedData
        });
    } catch (e) {
        response.status(500).json({code: 500, message: 'something went wrong...', error: e});
    }
}

export {
    create,
    update,
    findAll,
    findById,
    deleteLocation,
}