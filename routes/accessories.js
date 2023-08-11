const express = require('express');
const router = express.Router();

const accessoryModel = require('../models/accessory')

const path = require('path');

// multer set up
const multer = require('multer');
const storage = multer.diskStorage({
    destination: "./public/uploads/images/accessories",
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
})

// file size limit can be set too.
var upload = multer({ storage: storage })

router.get('/', (req, res) => {
    accessoryModel.find((err, accessoriesFound) => {
        if (err) {
            console.log('Error finding any accessories in database')
        }
        else {
            res.render('accessories/index', { title: "Our accessories", accessories: accessoriesFound })
        }
    })
    // res.render('accessories/index', {title: "Our accessories"})
})

// get method for add accessory
router.get('/add', (req, res) => {
    res.render('accessories/accessoryForm', { title: "accessory Inventory Update" })
})

//post method for add accessory form
router.post('/add', upload.single('file'), (req, res) => {
    // res.render('')

    var fileName = ''

    if (!req.file) {
        // console.log("No file received.");

    } else {
        // console.log('file received');
        fileName = req.file.filename
    }
    
    accessoryModel.create(
        {
            prodName: req.body.prodName,
            dimensions: req.body.dimensions,
            price: parseFloat(req.body.price),
            modelNumber: req.body.modelNumber,
            quantity: req.body.quantity,
            type: req.body.type,
            imageName: fileName
        }, (err, newaccessory) => {
            if (err) {
                console.log(`Error in making new accessory record entry \n ${err}`)
            }
            else {
                res.redirect('/accessories')
            }
        }
    )
})


// get router for Delete function
router.get('/delete/:id', (req, res) => {
    accessoryModel.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(`Error in deleting ${err}`)
        }
        else {
            res.redirect('/accessories')
        }
    })
})


// Get router for Edit page
router.get('/edit/:id', (req, res) => {
    accessoryModel.findById(req.params.id, (err, accessory) => {
        if (err) {
            console.log(err)
        }
        else (
            res.render('accessories/accessoryForm', { title: 'Edit accessory', accessoryFound: accessory })
        )
    })
})

// Post router for edit page
router.post('/edit/:id', upload.single('file'), (req, res) => {
    var fileName = ''
    if (req.file) {
        // console.log('file recieved')
        fileName = req.file.filename

    }
    else if (req.body.prevImgName) {
        fileName = req.body.prevImgName
        // console.log('file not recieved')
    }
    
    accessoryModel.findByIdAndUpdate(req.params.id, {
        prodName: req.body.prodName,
        dimensions: req.body.dimensions,
        price: parseFloat(req.body.price),
        modelNumber: req.body.modelNumber,
        quantity: req.body.quantity,
        type: req.body.type,
        imageName: fileName
    }, (err, updatedaccessory) => {
        if (err) {
            console.log(err)
        }
        else {
            res.redirect('/accessories')
        }
    })
})

module.exports = router