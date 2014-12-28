var DayModel = require('mongoose').model('Day');

exports.seedDays = function seedDays() {
    DayModel.find({}).exec(function (err, collection) {
        if (collection.length === 0) {
            DayModel.create({day: 'Sun-Tue'});
            DayModel.create({day: 'Mon-Wed'});
            DayModel.create({day: 'Thu-Sat'});
        }
    });
}
