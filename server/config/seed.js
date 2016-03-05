/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Foundation = require('../api/foundation/foundation.model');
var School = require('../api/school/school.model');
var Level = require('../api/level/level.model');
var Classd = require('../api/class/class.model');
var Story = require('../api/story/story.model');
var Photo = require('../api/photo/photo.model');
var Reply = require('../api/reply/reply.model');
var Group = require('../api/group/group.model');
var async = require('async');
var mongoose = require('mongoose');
var _ = require('lodash');

User.create([{
    provider: 'local',        
    name: 'Muhammad Latif',
    email: 'student.latif@kidzpotentia.sch.id',
    role: 'student',
    password: 'student.latif'
}, {
    provider: 'local',        
    name: 'Syahri yusnita',
    email: 'latif@kidzpotentia.sch.id',
    role: 'parent',
    password: 'parent.latif'
}] , function (err) {
    setTimeout(function () {
        User.find({name: 'Muhammad Latif'}, function (err, std) {
            User.find({name: 'Syahri yusnita'}, function (err, prn) {
                std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                std[0].save();

                prn[0]._student = mongoose.Types.ObjectId(std[0]._id);
                prn[0].save();
            });

            Classd.find({name: 'Playgroup'}, function (err, cls) {
                std[0]._class = mongoose.Types.ObjectId(cls[0]._id);
                std[0].save();

                cls[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                cls[0].save(); 
            });
        });
    },500);
});

User.create([{
    provider: 'local',        
    name: 'Nadine elaria kedna',
    email: 'student.nadine@kidzpotentia.sch.id',
    role: 'student',
    password: 'student.nadine'
}, {
    provider: 'local',        
    name: 'Ariani mandala',
    email: 'nadine@kidzpotentia.sch.id',
    role: 'parent',
    password: 'parent.nadine'
}] , function (err) {
    setTimeout(function () {
        User.find({name: 'Nadine elaria kedna'}, function (err, std) {
            User.find({name: 'Ariani mandala'}, function (err, prn) {
                std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                std[0].save();

                prn[0]._student = mongoose.Types.ObjectId(std[0]._id);
                prn[0].save();
            });

            Classd.find({name: 'Playgroup'}, function (err, cls) {
                std[0]._class = mongoose.Types.ObjectId(cls[0]._id);
                std[0].save();

                cls[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                cls[0].save(); 
            });
        });
    },500);
});

setTimeout(function () {
    Classd.findOne({name: 'Toddler'}, function (err, toddler) {
        Classd.findOne({name: 'Playgroup'}, function (err, playgroup) {
            Classd.findOne({name: 'Bayi'}, function (err, bayi) {
                var id = toddler._id;
                User.create([{
                    provider: 'local',        
                    name: 'Nura',
                    email: 'nura@kidzpotentia.sch.id',
                    role: 'teacher',
                    password: 'teacher.nura',
                    _class: playgroup._id
                },{
                    provider: 'local',        
                    name: 'Santi',
                    email: 'santi@kidzpotentia.sch.id',
                    role: 'teacher',
                    password: 'teacher.santi',
                    _class: toddler._id
                },{
                    provider: 'local',        
                    name: 'Puput',
                    email: 'puput@kidzpotentia.sch.id',
                    role: 'teacher',
                    password: 'teacher.puput',
                    _class: toddler._id
                }], function (err) {
                                            
                });
            });
        });
    })
},1000);