const express = require('express');
const router = express.Router();
const multer = require('multer');
const Image = require('../model/image_model');


//? Multer configuration for file upload in local storage

/* const storage = multer.diskStorage({
    destination : function (req , file , cb){
        cb(null , 'uploads/');
    },
    filename : function (req , file , cb){
        cb(null , file.originalname);
    }
}); */

//? Multer configuration for file upload in mongoDB storage as a (base64 string);

const storage = multer.memoryStorage()
const upload = multer({storage : storage});

router.get('/home' , (req , res) => {
    res.render('home.ejs');
});

router.post('/upload-file' , upload.single('file') , async (req , res) => {
    const filebase64 = req.file.buffer.toString('base64');
    const file = new Image({
        filename : req.file.originalname,
        bufferData : filebase64,
    });
    await file.save();
    res.send('File uploaded successfully!');
});

router.get('/files', async (req, res) => {
    try {
        const files = await Image.find(); // Fetch all files from the database
        res.render('files.ejs', { files }); // Render the files.ejs view with the files data
    } catch (error) {
        res.status(500).send('Error fetching files');
    }
});

router.get('/download/:id', async (req, res) => {
    try {
        const file = await Image.findById(req.params.id);
        if (!file) {
            return res.status(404).send('File not found');
        }
        const buffer = Buffer.from(file.bufferData, 'base64');
        res.set({
            'Content-Disposition': `attachment; filename="${file.filename}"`,
            'Content-Type': 'application/octet-stream',
        });
        res.send(buffer);
    } catch (error) {
        res.status(500).send('Error downloading file');
    }
});

module.exports = router;