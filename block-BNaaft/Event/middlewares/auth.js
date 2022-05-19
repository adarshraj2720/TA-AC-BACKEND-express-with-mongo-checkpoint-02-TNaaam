var Event = require('../modals/event');

module.exports = {
    allfilter: function (req, res, next) {
        Event.distinct('eventcategory', (err, eve) => {
            console.log(eve);
            Event.distinct('location', (err, even) => {
                console.log(even);

                res.locals.eventcategory = eve;
                res.locals.location = even;

                next();
            })

        })



    }
}
