const express = require('express');
const router = express.Router();

const tireModel = require('../models/tire')


router.get('/', (req, res) => {
    tireModel.find((err, tiresFound) => {
        if (err) {
            console.log('Error finding any tires in database')
        }
        else {
            res.render('tires/index', { title: "Our tires", tires: tiresFound })
        }
    })
    // res.render('tires/index', {title: "Our tires"})
})

// get method for add tire
router.get('/add', (req, res) => {
    res.render('tires/tireForm', { title: "tire Inventory Update" })
})

//post method for add tire form
router.post('/add', (req, res) => {
    // res.render('')
    tireModel.create(
        {
            brand: req.body.brand,
            category: req.body.category,
            sku: req.body.sku,
            price: req.body.price,
            size: req.body.size
        }, (err, newtire) => {
            if (err) {
                console.log('Error in making new tire entry')
            }
            else {
                res.redirect('/tires')
            }
        }
    )
})


// get router for Delete function
router.get('/delete/:id', (req, res) => {
    tireModel.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(`Error in deleting ${err}`)
        }
        else {
            res.redirect('/tires')
        }
    })
})


// Get router for Edit page
router.get('/edit/:id', (req, res) => {
    tireModel.findById(req.params.id, (err, tire) => {
        if (err) {
            console.log(err)
        }
        else (
            res.render('tires/tireForm', { title: 'Edit tire', tireFound: tire })
        )
    })
})

// Post router for edit page
router.post('/edit/:id', (req, res) => {
    tireModel.findByIdAndUpdate(req.params.id, {
        brand: req.body.brand,
        category: req.body.category,
        sku: req.body.sku,
        price: req.body.price,
        size: req.body.size
    }, (err, updatedtire) => {
        if (err) {
            console.log(err)
        }
        else {
            res.redirect('/tires')
        }
    })
})

module.exports = router