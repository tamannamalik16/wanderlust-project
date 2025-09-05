const Joi = require('joi');

const listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        price: Joi.number().required().min(1),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.object({
            url: Joi.string().uri().allow("", null) // allows an empty URL
                }).optional(),
        category: Joi.string().valid(
            'trending',
            'crafting',
            'boating',
            'farms',
            'iconic views',
            'beaches',
            'camping',
            'arctic'
        ).default('trending')
    }).required()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
})

module.exports = {listingSchema, reviewSchema};