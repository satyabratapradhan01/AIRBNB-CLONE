const Joi = require("joi");
// const Listing = require("./models/listing");

module.exports.listingSchema = Joi.object({
    Listing: Joi.object({
        title: Joi.string().required(),
        descdescription: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required(),
        image: Joi.string().allow("", null),
    }).required(),
});