const express = require('express');
const { registerUser, loginUser, getUserPorfile, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authmiddleware');
const upload = require('../middlewares/uploadmiddleware');
const router = express.Router();

router.post("/register", registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserPorfile);
router.put('/profile', protect, updateUserProfile);

router.post('/upload-image',upload.single("image"),(req,res)=>{
    if(!req.file){
        return res.status(400).json({message:"no file uploaded"});  
    }
    const imageUrl =`${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({imageUrl});
})

module.exports = router;
