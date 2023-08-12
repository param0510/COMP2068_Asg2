const express = require('express');
const router = express.Router();
const path = require('path');

const carModel = require('../models/car')

// importing the isLogginIn function to check authorization
const isLoggedInUtility = require('../utilities/authUtility')


// image upload setup
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


// get method for default url "cars/" -> displays the index page 
router.get('/', (req, res) => {
    
    carModel.find((err, carsFound) => {
        if (err) {
            console.log('Error finding any cars in database')
        }
        else {
            res.render('cars/index', { title: "Our Cars", cars: carsFound, authUser: req.user })
        }
    })
})

// get method for add car
router.get('/add', isLoggedInUtility , (req, res) => {
    res.render('cars/carForm', { title: "Car Inventory Update", authUser: req.user })
})

//post method for add car form
router.post('/add', isLoggedInUtility, upload.single('file') , (req, res) => {

    var fileName = ''

    if (!req.file) {
        console.log("No file received.");

    } else {
        console.log('file received');
        fileName = req.file.filename
    }

    // creating a new car entry in the database
    carModel.create(
        {
            make: req.body.make,
            model: req.body.model,
            year: req.body.year,
            mileage: req.body.mileage,
            transmission: req.body.transmission,
            imageName: fileName,
            desc: req.body.desc
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

// get method for cars/delete/:id
router.get('/delete/:id', isLoggedInUtility, (req, res) => {
    carModel.findByIdAndRemove(req.params.id, (err) => {
        if (err){
            console.log(`Error in deleting ${err}`)
        }
        else{
            res.redirect('/cars')
        }
    })
})

// get method for cars/edit/:id
router.get('/edit/:id', isLoggedInUtility, (req, res) => {
    carModel.findById(req.params.id, (err, car) => {
        if (err){
            console.log(err)
        }
        else(
            res.render('cars/carForm', { title: 'Edit Car', carFound: car, authUser: req.user })
        )
    })
})

// post method for cars/edit/:id - edits a specific car(found using id parameter) stored in database
router.post('/edit/:id', isLoggedInUtility, upload.single('file'), (req, res) => {

    var fileName = ''
    if(req.file){
        // console.log('file recieved')
        fileName = req.file.filename
        
    }
    else if(req.body.prevImgName){
        fileName = req.body.prevImgName
        // console.log('file not recieved')
    }

    // editing a given car in the database
    carModel.findByIdAndUpdate(req.params.id, {
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        mileage: req.body.mileage,
        transmission: req.body.transmission,
        imageName: fileName,
        desc: req.body.desc
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