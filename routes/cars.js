const express = require('express');
const router = express.Router();

const carModel = require('../models/car')

const path = require('path');

// multer set up
const multer = require('multer');
const storage = multer.diskStorage({
    destination: "./public/uploads/images/cars",
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '_' + Date.now() +  path.extname(file.originalname))
    }
})

// file size limit can be set too.
var upload = multer({storage: storage})


router.get('/', (req, res) => {
    carModel.find((err, carsFound) => {
        if (err) {
            console.log('Error finding any cars in database')
        }
        else {
            res.render('cars/index', { title: "Our Cars", cars: carsFound })
        }
    })
    // res.render('cars/index', {title: "Our Cars"})
})

// get method for add car
router.get('/add', (req, res) => {
    res.render('cars/carForm', {title: "Car Inventory Update"})
})

//post method for add car form
router.post('/add', upload.single('file') , (req, res) => {

    var fileName = ''

    if (!req.file) {
        console.log("No file received.");

    } else {
        console.log('file received');
        fileName = req.file.filename
    }


    carModel.create(
        {
            make: req.body.make,
            model: req.body.model,
            year: req.body.year,
            mileage: req.body.mileage,
            transmission: req.body.transmission,
            imageName: fileName
        }, (err, newCar) =>{
            if(err) {
                console.log('Error in making new car entry')
            }
            else{
                res.redirect('/cars')
            }
        }
    )
})

router.get('/delete/:id', (req, res) => {
    carModel.findByIdAndRemove(req.params.id, (err) => {
        if (err){
            console.log(`Error in deleting ${err}`)
        }
        else{
            res.redirect('/cars')
        }
    })
})

router.get('/edit/:id', (req, res) => {
    carModel.findById(req.params.id, (err, car) => {
        if (err){
            console.log(err)
        }
        else(
            res.render('cars/carForm', {title: 'Edit Car', carFound: car})
        )
    })
})

router.post('/edit/:id', upload.single('file'), (req, res) => {

    var fileName = ''
    if(req.file){
        // console.log('file recieved')
        fileName = req.file.filename
        
    }
    else if(req.body.prevImgName){
        fileName = req.body.prevImgName
        // console.log('file not recieved')
    }

    carModel.findByIdAndUpdate(req.params.id, {
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        mileage: req.body.mileage,
        transmission: req.body.transmission,
        imageName: fileName
    }, (err, updatedCar) => {
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/cars')
        }
    })
})

module.exports = router