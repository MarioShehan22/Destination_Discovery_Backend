import User from "../model/UserSchema.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Guide from "../model/GuideSchema.mjs";
import Tourist from "../model/TouristSchema.mjs";

const save = async (req, res)=>{
    try {
        // Validate input
        const { email, username, password, role } = req.body;

        // Check if user already exists
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Create new user
        user = new User({email, username, password, role,
            // Add additional fields based on userType
            // ...(userType === 'Guide' && { expertise: req.body.expertise, languages: req.body.languages })
        });

        await user.save();

        return res.status(201).json({ 'message': 'User was Saved!' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send({message: err.message});
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid Email' });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Password' });

        // let tempUser;
        // if (user.role === "Guide") {
        //     tempUser = await Guide.findOne({ userId: user._id.toString() });
        //     if (!tempUser) {
        //         return res.status(404).json({ message: 'Guide profile not found' });
        //     }
        // } else if (user.role === "Tourist") {
        //     tempUser = await Tourist.findOne({ userId: user._id.toString() });
        //     if (!tempUser) {
        //         return res.status(404).json({ message: 'Tourist profile not found' });
        //     }
        // }

        const payload = {
            user: {
                id: user._id.toString(),
                profileId: user._id,
                username: user.username,
                role: user.role,
            }
        };

        const secretKey = process.env.JWT_SECRET;
        const expiresIn = '2h';
        if (!secretKey) {
            return res.status(500).json({ 'error': 'Missing secret key' });
        }
        const token = jwt.sign(payload, secretKey, { expiresIn });

        return res.status(200).json({token, payload});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

const findAll = async (req, res) => {
    try {
        //find all users using UserSchema
        const users = await User.find();
        //If user data is not returned
        if (!users) return res.status(404).json({ message: 'No users data' });
        //Count number of user data
        const count = await User.countDocuments();

        res.status(200).json({message:"data list",dataCount:count,data:users});
    }catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

const findById = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) return res.status(404).json({ message: 'No role id provide' });
        const users = await User.findOne({_id:userId});
        if (!users) return res.status(404).json({ message: 'No user data' });
        const count = await User.countDocuments();

        res.status(200).json({message:"User data",data:users});
    }catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
export {
    save,
    login,
    findAll,
    findById,
}
