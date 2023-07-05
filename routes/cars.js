const express = require('express');
const router = express.Router();

const carModel = require('../models/car')


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
router.post('/add', (req, res) => {
    // res.render('')
    carModel.create(
        {
            make: req.body.make,
            model: req.body.model,
            year: req.body.year,
            mileage: req.body.mileage,
            transmission: req.body.transmission
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

router.post('/edit/:id', (req, res) => {
    carModel.findByIdAndUpdate(req.params.id, {
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        mileage: req.body.mileage,
        transmission: req.body.transmission
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