const express = require('express');
const router = express.Router();

const batteryModel = require('../models/battery')


router.get('/', (req, res) => {
    batteryModel.find((err, batteriesFound) => {
        if (err) {
            console.log('Error finding any batteries in database')
        }
        else {
            res.render('batteries/index', { title: "Our batteries", batteries: batteriesFound })
        }
    })
    // res.render('batteries/index', {title: "Our batteries"})
})

// get method for add battery
router.get('/add', (req, res) => {
    res.render('batteries/batteryForm', { title: "battery Inventory Update" })
})

//post method for add battery form
router.post('/add', (req, res) => {
    // res.render('')
    batteryModel.create(
        {
            brand: req.body.brand,
            reserveCapacity: req.body.reserveCapacity,
            manufacPartNumber: req.body.manufacPartNumber,
            price: parseFloat(req.body.price),
            bciGrpSize: req.body.bciGrpSize
        }, (err, newbattery) => {
            if (err) {
                console.log(`Error in making new battery record entry \n ${err}`)
            }
            else {
                res.redirect('/batteries')
            }
        }
    )
})


// get router for Delete function
router.get('/delete/:id', (req, res) => {
    batteryModel.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(`Error in deleting ${err}`)
        }
        else {
            res.redirect('/batteries')
        }
    })
})


// Get router for Edit page
router.get('/edit/:id', (req, res) => {
    batteryModel.findById(req.params.id, (err, battery) => {
        if (err) {
            console.log(err)
        }
        else (
            res.render('batteries/batteryForm', { title: 'Edit battery', batteryFound: battery })
        )
    })
})

// Post router for edit page
router.post('/edit/:id', (req, res) => {
    batteryModel.findByIdAndUpdate(req.params.id, {
        brand: req.body.brand,
        reserveCapacity: req.body.reserveCapacity,
        manufacPartNumber: req.body.manufacPartNumber,
        price: parseFloat(req.body.price),
        bciGrpSize: req.body.bciGrpSize
    }, (err, updatedbattery) => {
        if (err) {
            console.log(err)
        }
        else {
            res.redirect('/batteries')
        }
    })
})

module.exports = router