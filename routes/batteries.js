const express = require('express');
const router = express.Router();
const path = require('path');

const batteryModel = require('../models/battery')

// login checker utility
const isLoggedInUtility = require('../utilities/authUtility')


// multer set up
const multer = require('multer');
const storage = multer.diskStorage({
    destination: "./public/uploads/images/batteries",
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
})

// file size limit can be set too.
var upload = multer({ storage: storage })

router.get('/', (req, res) => {
    batteryModel.find((err, batteriesFound) => {
        if (err) {
            console.log('Error finding any batteries in database')
        }
        else {
            res.render('batteries/index', { title: "Our batteries", batteries: batteriesFound, authUser: req.user })
        }
    })
    // res.render('batteries/index', {title: "Our batteries"})
})

// get method for add battery
router.get('/add', isLoggedInUtility, (req, res) => {
    res.render('batteries/batteryForm', { title: "battery Inventory Update", authUser: req.user })
})

//post method for add battery form
router.post('/add', isLoggedInUtility, upload.single('file'), (req, res) => {
    var fileName = ''

    if (!req.file) {
        // console.log("No file received.");

    } else {
        // console.log('file received');
        fileName = req.file.filename
    }

    batteryModel.create(
        {
            brand: req.body.brand,
            reserveCapacity: req.body.reserveCapacity,
            manufacPartNumber: req.body.manufacPartNumber,
            price: parseFloat(req.body.price),
            bciGrpSize: req.body.bciGrpSize,
            imageName: fileName,
            desc: req.body.desc
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
router.get('/delete/:id', isLoggedInUtility, (req, res) => {
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
router.get('/edit/:id', isLoggedInUtility, (req, res) => {
    batteryModel.findById(req.params.id, (err, battery) => {
        if (err) {
            console.log(err)
        }
        else (
            res.render('batteries/batteryForm', { title: 'Edit battery', batteryFound: battery, authUser: req.user })
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
    
    batteryModel.findByIdAndUpdate(req.params.id, {
        brand: req.body.brand,
        reserveCapacity: req.body.reserveCapacity,
        manufacPartNumber: req.body.manufacPartNumber,
        price: parseFloat(req.body.price),
        bciGrpSize: req.body.bciGrpSize,
        imageName: fileName,
        desc: req.body.desc
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