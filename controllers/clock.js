const AppError = require('../libs/app-error');
const Clocks   = require('../models/clock.js');

const hardCode = require('../hardcode/clocks.json');

module.exports = {
    getAll(req, res, next) {
        Clocks.find({}, (err, clocks) => {
            if(err)
                return next(new AppError(500));

            res.json(clocks);
        });
    },

    getById(req, res, next) {
        const id = req.query.id;

        if(!id) 
            return next(new AppError(400));

        Clocks.findById(id, (err, clock) => {
            if(err)
                return next(new AppError(500));

            if(!clock) 
                return next(new AppError(404));

            res.json(clock);
        });
    },

    putClock(req, res, next) {
        hardCode.forEach(clock => {
            let newClock = new Clocks(clock);

            newClock.save((err, ok) => {
                if(err)
                    return next(new AppError(500));
            });
        });

        res.json("ok");
    }
};