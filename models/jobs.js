const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');
const geoCoder = require('../utils/geocoder');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter Jobtitle'],
        trim: true,
        maxlength: [100, 'Jobtitle cannot exceed 100 character.']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please enter Job description'],
        maxlength: [1000, 'Job description can not exceed 1000 characters.']
    },
    email: {
        type: String,
        validate: [validator.isEmail, 'Please add a valid email.']
    },
    address: {
        type: String,
        require: [true, 'Please add an address']
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    company: {
        type: String,
        required: [true, 'Please add company name']
    },
    industry: {
        type: [String],
        require: true,
        enum: {
            values: [
                'Bussiness',
                'Information Technology',
                'Banking',
                'Education/Training',
                'Telecomunication',
                'Others'
            ],
            message: 'Please select correct options for industry.'
        }
    },
    jobType: {
        type: String,
        require: true,
        enum: {
            values: [
                'Permanent',
                'Temporary',
                'Internship'
            ],
            message: 'Please select correct options for job type'
        }
    },
    minEducation: {
        type: String,
        require: true,
        enum: {
            values: [
                'Bachelors',
                'Masters',
                'Phd'
            ],
            message: 'Please select correct options for Education'
        }
    },
    positions: {
        type: Number,
        default: 1
    },
    experience: {
        type: String,
        require: true,
        enum: {
            values: [
                'No Experience',
                '1 Year - 2 Years',
                '2 Year - 5 Years',
                '5 Years+'
            ],
            message: 'Please select correct option for experience.'
        }
    },
    salary: {
        type: Number,
        required: [true, 'Please enter expected salary for this job'],
    },
    postingDate: {
        type: Date,
        default: Date.now
    },
    lastDate: {
        type: Date,
        default: new Date().setDate(new Date().getDate() + 7)
    },
    applicantApplied: {
        type: [Object],
        select: false,
    }
});

// creating job slug 
jobSchema.pre('save', function (next) {
    // creating slug before saving to db 
    this.slug = slugify(this.title, { lower: true });

    next();
})


// setting up location 
jobSchema.pre('save', async function (next) {
    const loc = await geoCoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAdress: loc[0].formattedAdress,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    }
})

module.exports = mongoose.model('Job', jobSchema);