import GuideSchema from "../model/GuideSchema.mjs";

const create = async (req, res) => {
    try{
        const guide = new GuideSchema(req.body);
        await guide.save();
        res.status(201).send({"message": "Guide Save successfully"});
    }catch(err){
        console.log(err);
        res.status(500).send('Server error');
    }
}

const update = async (req, res) => {
    try {
        const {userId, firstName, lastName,profilePhoto,expertise,languages,bio,education,phoneNumber,is_active} = req.body;
        if (!userId || !firstName || !lastName) {
            return res.status(400).json({code: 400, message: 'some fields are missing!..', data: null});
        }
        const updateData = await GuideSchema.findOneAndUpdate({'_id': req.params.id}, {
            $set: {
                userId: userId,
                firstName: firstName,
                lastName: lastName,
                profilePhoto:profilePhoto,
                expertise: expertise,
                languages: languages,
                bio: bio,
                education: education,
                phoneNumber: phoneNumber,
                is_active: is_active,
            }
        }, {new: true});
        return res.status(200).json({code: 200, message: 'Guide record has been updated...', data: updateData});
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
        const DataList = await GuideSchema.find()
            .limit(pageSize)
            .skip(skip);
        const DataListCount = await GuideSchema.countDocuments();

        return res.status(200).json({
            code: 200,
            message: 'location data data...',
            data: {list: DataList, dataCount: DataListCount}
        });
    } catch (e) {
        res.status(500).json({code: 500, message: 'something went wrong...', error: e});
    }
}

const findById = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({code: 400, message: 'guide id is missing!..', data: null});
        }
        const Data =
            await GuideSchema.findById({'_id': req.params.id});
        if (Data) {
            return res.status(200).json({code: 200, message: 'guide data...', data: Data});
        }
        return res.status(404).json({code: 404, message: 'guide data not found...', data: null});
    } catch (e) {
        res.status(500).json({code: 500, message: 'something went wrong...', error: e});
    }
}

const deleteGuide = async (request, response) => {
    try {
        if (!request.params.id) {
            return response.status(400).json({code: 400, message: 'guide id is missing!..', data: null});
        }
        const deletedData =
            await GuideSchema.findOneAndDelete({'_id': request.params.id});
        return response.status(204).json({
            code: 204,
            message: 'guide record has been deleted...',
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
    deleteGuide
}