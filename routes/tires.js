const express = require('express');
const router = express.Router();
const path = require('path');

const tireModel = require('../models/tire')

// login checker utility
const isLoggedInUtility = require('../utilities/authUtility')


// multer set up
const multer = require('multer');
const storage = multer.diskStorage({
    destination: "./public/uploads/images/tires",
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
})

// file size limit can be set too.
var upload = multer({ storage: storage })

router.get('/', (req, res) => {
    tireModel.find((err, tiresFound) => {
        if (err) {
            console.log('Error finding any tires in database')
        }
        else {
            res.render('tires/index', { title: "Our tires", tires: tiresFound, authUser: req.user })
        }
    })
    // res.render('tires/index', {title: "Our tires"})
})



// get method for add tire
router.get('/add', isLoggedInUtility, isLoggedInUtility, (req, res) => {
    res.render('tires/tireForm', { title: "tire Inventory Update", authUser: req.user })
})

//post method for add tire form
router.post('/add', isLoggedInUtility, upload.single('file'), (req, res) => {

    var fileName = ''

    if (!req.file) {
        // console.log("No file received.");

    } else {
        // console.log('file received');
        fileName = req.file.filename
    }

    tireModel.create(
        {
            brand: req.body.brand,
            category: req.body.category,
            sku: req.body.sku,
            price: req.body.price,
            size: req.body.size,
            imageName: fileName,
            desc: req.body.desc
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
router.get('/delete/:id', isLoggedInUtility, (req, res) => {
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
router.get('/edit/:id', isLoggedInUtility, (req, res) => {
    tireModel.findById(req.params.id, (err, tire) => {
        if (err) {
            console.log(err)
        }
        else (
            res.render('tires/tireForm', { title: 'Edit tire', tireFound: tire, authUser: req.user })
        )
    })
})

// Post router for edit page
router.post('/edit/:id', isLoggedInUtility, upload.single('file'), (req, res) => {

    var fileName = ''
    if (req.file) {
        // console.log('file recieved')
        fileName = req.file.filename

    }
    else if (req.body.prevImgName) {
        fileName = req.body.prevImgName
        // console.log('file not recieved')
    }

    tireModel.findByIdAndUpdate(req.params.id, {
        brand: req.body.brand,
        category: req.body.category,
        sku: req.body.sku,
        price: req.body.price,
        size: req.body.size,
        imageName: fileName,
        desc: req.body.desc
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