import User from "../model/UserSchema.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const save = async (req, res)=>{
    try {
        // Validate input
        const { firstName, lastName, email, username, password, phoneNumber, userType } = req.body;

        // Check if user already exists
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Create new user
        user = new User({
            firstName, lastName, email, username, password, phoneNumber, userType,
            // Add additional fields based on userType
            ...(userType === 'Guide' && { expertise: req.body.expertise, languages: req.body.languages })
        });

        await user.save();

        return res.status(201).json({ 'message': 'User was Saved!' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
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

        // Generate JWT
        const payload = {
            user: {
                _id: user._id,
                userType: user.userType
            }
        };

        const secretKey=process.env.SECRET_KEY;
        const expiresIn='2h';
        if (!secretKey) {
            return res.status(500).json({ 'error': 'Missing secret key' });
        }
        const token = jwt.sign(payload, secretKey, { expiresIn });

        return res.status(200).json({token,payload});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

export {
    save,
    login
}
