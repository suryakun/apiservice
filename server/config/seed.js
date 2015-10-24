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
var async = require('async');

Foundation.find({}).remove(function() {
    Foundation.create({
        _school: [],
        name: 'Tirta Jasa',
        address: 'Jln. Dipatiukur',
        phone: '0998798798',
        owner: 'Agus Salim',
        active: true
    }, function() {
        setTimeout(function (argument) {
            School.findOne({ name: 'PG Tirta jasa 2' }, function (err, school) {
                Foundation.findOne({ name: 'Tirta Jasa'}, function (err, found) {
                    found._school.push(school._id);
                    found.save();
                });
            });
        }, 1000);
        console.log('finished populating foundation');
    });  

});

School.find({}).remove(function() {
    School.create({
        address: 'Bandung',
        phone: '987986987697',
        principal: 'Agus NdP',
        name: 'PG Tirta jasa 2',
        info: 'Sekolah dasar negeri',
        active: true
    }, function() {
        Foundation.findOne({ name: 'Tirta Jasa'}, function (err, found) {
            School.findOne({ name: 'PG Tirta jasa 2' }, function (err, school) {
                school._foundation = found._id;
                school.save();
            });
        });

        console.log('finished populating school');
    });    
});

Level.find({}).remove(function() {
    Level.create({
        grade: 'nol kecil',
        info: 'nol kecil TK',
        active: true
    }, {
        grade: 'nol besar',
        info: 'nol besar TK',
        active: true
    });
});

Classd.find({}).remove(function() {
    Classd.create({
        name: 'Bunga Matahari',
        info: 'Kelas Bunga Matahari',
        active: true
    }, function () {

        //set relation to level
        Level.findOne({ grade: 'nol kecil'}, function (err, level) {
            Classd.findOne({name: 'Bunga Matahari'}, function (err, cls) {
                cls._level = level._id;
                cls.save();

                level._class.push(cls._id);
                level.save();
            });
        });

        //set relation to school
        School.findOne({ name: 'PG Tirta jasa 2'}, function (err, scl) {
            Classd.findOne({name: 'Bunga Matahari'}, function (err, cls) {
                cls._school = scl._id;                
                cls.save();

                scl._class.push(cls._id);
                scl.save();
            });
        });

    });
});

User.find({}).remove(function() {
    User.create({
        provider: 'local',        
        name: 'Parent satu',
        email: 'parent1@test.com',
        role: 'parent',
        password: 'parent1'
    }, {
        provider: 'local',
        name: 'Student satu',
        email: 'student1@test.com',
        role: 'student',
        password: 'student1'
    },
    {
        provider: 'local',
        name: 'Parent dua',
        email: 'parent2@test.com',
        role: 'parent',
        password: 'parent2'
    }, {
        provider: 'local',
        name: 'Student dua',
        email: 'student2@test.com',
        role: 'student',
        password: 'student2'
    }, {
        provider: 'local',
        name: 'Teacher satu',
        email: 'teacher1@test.com',
        role: 'teacher',
        password: 'teacher1'
    }, {
        provider: 'local',
        name: 'Teacher dua',
        email: 'teacher2@test.com',
        role: 'teacher',
        password: 'teacher2'
    }, {
        provider: 'local',
        name: 'Test',
        email: 'test@test.com',
        password: 'test'
    }, {
        provider: 'local',
        role: 'admin',
        name: 'Admin',
        email: 'admin@admin.com',
        password: 'admin'
    }, function() {
        //relation parent to student
        User.findOne({ name: 'Parent satu'}, function (err, prnt) {
            User.findOne({ name: 'Student satu'}, function (err, stdn) {
                stdn._parent = prnt._id;
                stdn.save();

                prnt._student.push(stdn._id);
                prnt.save();
            });
        });

        Classd.findOne({name: 'Bunga Matahari'}, function (err, cls) {
           User.findOne({ name: 'Student satu'}, function (err, stdn) {
                stdn._class = cls._id;
                stdn.save();

                cls._student.push(stdn._id);
                cls.save();
            }); 
        });

        Classd.findOne({name: 'Bunga Matahari'}, function (err, cls) {
           User.findOne({ name: 'Student dua'}, function (err, stdn) {
                stdn._class = cls._id;
                stdn.save();

                cls._student.push(stdn._id);
                cls.save();
            }); 
        });

        Classd.findOne({name: 'Bunga Matahari'}, function (err, cls) {
           User.findOne({ name: 'Teacher satu'}, function (err, tcr) {
                tcr._class = cls._id;
                tcr.save();

                cls._teacher.push(tcr._id);
                cls.save();
            }); 
        });
        console.log('finished populating users');
    });
});

Photo.find({}).remove(function() {
    Photo.create({
        url: 'http://localhost:8000/image/info.png',
        active: true
    }, {
        url: 'http://localhost:8000/image/diary.png',
        active: true
    });
});

Story.find({}).remove(function() {
    Story.create({
        info: 'This is My first Post. Awesome',
        type: 'info',
        active: true,
    }, {
        info: 'This is Diary. Just for any parent',
        isDiary: true,
        active: true,
    }, function () {
        Story.findOne({info: 'This is My first Post. Awesome'}, function (err, story) {
            //relation story to teacher
            setTimeout(function (argument) {
                User.findOne({ name: 'Teacher satu'}, function (err, tcr) {
                    story._teacher = tcr._id;
                    story.save();

                    tcr._story.push(story._id);
                    tcr.save();
                });
            },1500);

            //relation story to class
            Classd.findOne({name: 'Bunga Matahari'}, function (err, cls) {
                story._class.push(cls._id);
                story.save();

                cls._story = story._id;
                cls.save();
            });

            Photo.findOne({url: 'http://localhost:8000/image/info.png'}, function (err, photo) {
                story._photo.push(photo._id);
                story.save();

                photo._story = story._id;
                photo.save();
            });         
        });

        Story.findOne({info: 'This is Diary. Just for any parent'}, function (err, story) {
            //relation story to teacher
            setTimeout(function (argument) {
                User.findOne({ name: 'Teacher satu'}, function (err, tcr) {
                    story._teacher = tcr._id;
                    story.save();
                });
            },1000);

            //relation story to parent
            User.findOne({ name: 'Parent dua'}, function (err, prnt) {
                story._parent.push(prnt._id);
                story.save();
            });

            Photo.findOne({url: 'http://localhost:8000/image/diary.png'}, function (err, photo) {
                story._photo.push(photo._id);
                story.save();

                photo._story = story._id;
                photo.save();
            });      
        });    

    });
});

Reply.find({}).remove(function() {
    Reply.create({
        info: 'This is my first reply',
        active: true    
    }, function () {
        Reply.findOne({info: 'This is my first reply'}, function (err, reply) {
            Story.findOne({info: 'This is My first Post. Awesome'}, function (err, story) {
                story._reply.push(reply._id);
                story.save();

                reply._story = story._id;
                reply.save();
            });

            setTimeout(function (argument) {
                User.findOne({ name: 'Parent satu'}, function (err, prnt) {
                    prnt._reply.push(reply._id);
                    prnt.save();

                    reply._parent = prnt._id;
                    reply.save();
                });      
            }, 1000);
        });
    });
});
