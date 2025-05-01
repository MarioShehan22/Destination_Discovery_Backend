import TouristSchema from "../model/TouristSchema.mjs";

const create = async (req,res) => {
    try {
        const touristSchema = new TouristSchema(req.body);
        await touristSchema.save();
        res.status(201).send({"message": "Tourist Save successfully"});
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
const findAll = async (req,res)=>{
    try {
        const tourist = await TouristSchema.find();
        if (!tourist) return res.status(404).json({ message: 'No Tour Data' });
        const count = await TouristSchema.countDocuments();

        res.status(200).json({message:"data list",dataCount:count,data:tourist});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

export {
    create,
    findAll
}