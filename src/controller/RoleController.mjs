import Role from '../model/RoleSchema';

const create = async (req,res)=>{
    const {role, description}=req.body;
    try{
        const newRole = new Role({
            role:role,
            description:description
        });
        const saveData = await newRole.save();
        return res.status(201).json({message:'role created',data:saveData});
    }catch (e) {
        res.status(500).json({error:e});
    }
}

const findAll = async (req,res)=>{
    try {
        const roles = await Role.find();
        if (!roles) return res.status(404).json({ message: 'No Roles Data' });
        const count = await Role.countDocuments();

        res.status(200).json({message:"data list",dataCount:count,data:roles});
    }catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

const remove = async (req,res)=>{
    try {
        const userId = req.params.id;
        if (!userId) return res.status(404).json({ message: 'No role id provide' });
        const temp = await Role.deleteOne({_id: userId});
        res.status(204).json({message:"Role was delete",data:temp});
    }catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
export {
    create,
    findAll,
    remove,
}
