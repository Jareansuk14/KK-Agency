const router = require('express').Router();
const multer = require('multer');
const ListingSell = require('../models/ListingSell');
const User = require('../models/User');

/* Configuration Multer for File Upload */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Store uploaded files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  }
});

const upload = multer({ storage });

/* POST create new listing for sell */
router.post('/createforsell', upload.array('listingPhotos'), async (req, res) => {
  try {
    const {
      creator,
      category,
      type,
      location,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      area,
      amenities,
      title,
      description,
      highlight,
      highlightDesc,
      statusroom,
      price
    } = req.body;

    const listingPhotos = req.files;

    if (!listingPhotos) {
      return res.status(400).send('No file uploaded.');
    }

    const listingPhotoPaths = listingPhotos.map((file) => file.path);

    const newListingSell = new ListingSell({
      creator,
      category,
      type,
      location,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      area,
      amenities,
      listingPhotoPaths,
      title,
      description,
      highlight,
      highlightDesc,
      statusroom,
      price
    });

    await newListingSell.save();

    res.status(200).json(newListingSell);
  } catch (err) {
    res.status(409).json({ message: 'Fail to create ListingSell', error: err.message });
    console.log(err);
  }
});

/* GET LISTINGSELL BY CATEGORY */
router.get('/', async (req, res) => {
  const qCategorySell = req.query.categorysell;

  try {
    let listingSell;
    if (qCategorySell) {
      listingSell = await ListingSell.find({ categorysell: qCategorySell }).populate('creator');
    } else {
      listingSell = await ListingSell.find().populate('creator');
    }

    res.status(200).json(listingSell);
  } catch (err) {
    res.status(404).json({ message: 'Fail to fetch listings', error: err.message });
    console.log(err);
  }
});

/* GET LISTINGS BY TYPE */
router.get('/type/:type', async (req, res) => {
  const { type } = req.params;

  try {
    let listingSell = [];

    if (type === 'all') {
      listingSell = await ListingSell.find().populate('creator');
    } else {
      listingSell = await ListingSell.find({
        $or: [{ type: { $regex: type, $options: 'i' } }]
      }).populate('creator');
    }

    res.status(200).json(listingSell);
  } catch (err) {
    res.status(404).json({ message: 'Fail to fetch listings', error: err.message });
    console.log(err);
  }
});

/* GET LISTINGS BY SEARCH */
router.get('/search/:search', async (req, res) => {
  const { search } = req.params;

  try {
    let listingSell = [];

    if (search === 'all') {
      listingSell = await ListingSell.find().populate('creator');
    } else {
      listingSell = await ListingSell.find({
        $or: [
          { category: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
          { type: { $regex: search, $options: 'i' } },
          { streetAddress: { $regex: search, $options: 'i' } },
          { aptSuite: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      }).populate('creator');
    }

    res.status(200).json(listingSell);
  } catch (err) {
    res.status(404).json({ message: 'Fail to fetch listings', error: err.message });
    console.log(err);
  }
});

/* LISTING DETAILS */
router.get('/:listingId', async (req, res) => {
  try {
    const { listingId } = req.params;
    const listingSell = await ListingSell.findById(listingId).populate('creator');
    res.status(202).json(listingSell);
  } catch (err) {
    res.status(404).json({ message: 'Listing can not found!', error: err.message });
  }
});

module.exports = router;
