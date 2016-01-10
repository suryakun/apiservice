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

Foundation.find({}).remove(function() {
    Foundation.create({
        _school: [],
        name: 'Kidz Potentia',
        address: 'Bandung',
        phone: '0998798798',
        owner: 'Ibu Ade',
        active: true
    }, function() {
        setTimeout(function (argument) {
            School.findOne({ name: 'Kidz Potentia' }, function (err, school) {
                Foundation.findOne({ name: 'Kidz Potentia'}, function (err, found) {
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
        principal: 'Ibu Ade',
        name: 'Kidz Potentia',
        info: 'Play Group',
        active: true
    }, function() {
        Foundation.findOne({ name: 'Kidz Potentia'}, function (err, found) {
            School.findOne({ name: 'Kidz Potentia' }, function (err, school) {
                school._foundation = found._id;
                school.save();
            });
        });

        console.log('finished populating school');
    });    
});

Level.find({}).remove(function() {
    setTimeout(function (argument) {
        School.findOne({ name: 'Kidz Potentia' }, function (err, school) {
            Level.create({
                _school: school._id,
                grade: 'nol kecil',
                info: 'nol kecil TK',
                active: true
            }, {
                _school: school._id,
                grade: 'nol besar',
                info: 'nol besar TK',
                active: true
            });
        });
    }, 500);
});

Classd.find({}).remove(function() {

    Classd.create({
        name: 'Toddler',
        info: 'Kelas Collection',
        active: true
    }, {
        name: 'Playgroup',
        info: 'Kelas Collection',
        active: true
    }, {
        name: 'Bayi',
        info: 'Kelas Collection',
        active: true
    }, function (err, cls) {
        //set relation to level
        setTimeout(function (argument) {
            Level.findOne({ grade: 'nol kecil'}, function (err, level) {
                cls._level = level._id;
                cls.save();

                level._class.push(cls._id);
                level.save();
            });
        },3000);

        //set relation to school
        setTimeout(function (argument) {
            School.findOne({ name: 'Kidz Potentia'}, function (err, scl) {
                var class_name = ['Toddler','Playgroup','Bayi'];
                Classd.update({name: {$in: class_name} }, { $set: {_school: mongoose.Types.ObjectId(scl._id)} }, {multi:true}, function (err, ok) {
                    console.log(ok)
                })

                Classd.find({name: {$in: class_name}}).exec(function (err, clsd) {
                    var ids = _.map(clsd, function (n) {
                        return n._id;
                    })
                    
                    School.update({_id: scl._id}, {$pushAll: {_class:ids}}, {multi:true}).exec(function (err, ok) {
                        console.log(ok);
                    });
                })
                
            });
        },2000);

    });    
});

setTimeout(function (argument) {
    User.find({}).remove(function() {

//Student
    User.create([{
        provider: 'local',        
        name: 'Adelia Aqila Azka Hartoyo',
        email: 'student.adelia.aqila@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.adelia'
    }, {
        provider: 'local',        
        name: 'Adyati Pradini Yudison',
        email: 'adelia@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.adelia'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Adelia Aqila Azka Hartoyo'}, function (err, std) {
                User.find({name: 'Adyati Pradini Yudison'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
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
        name: 'Akiela Putri Arkadian',
        email: 'student.akiela@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.akiela'
    }, {
        provider: 'local',        
        name: 'Mariska Tri Adithia',
        email: 'akiela@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.akiela'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Akiela Putri Arkadian'}, function (err, std) {
                User.find({name: 'Mariska Tri Adithia'}, function (err, prn) {
                    if (!prn) {console.log("err"); return false};

                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'Toddler'}, function (err, cls) {
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
        name: 'Kenzie Xavier Abrizan Jaelani',
        email: 'student.kenzie@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.kenzie'
    }, {
        provider: 'local',        
        name: "Kenzie's Parent",
        email: 'kenzie@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.kenzie'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Kenzie Xavier Abrizan Jaelani'}, function (err, std) {
                User.find({name: "Kenzie's Parent"}, function (err, prn) {
                    if (!prn) {console.log("err"); return false};

                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'Toddler'}, function (err, cls) {
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
        name: 'Syaika Syuhda Suganda',
        email: 'student.syaika@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.syaika'
    }, {
        provider: 'local',        
        name: "Syaika's Parent",
        email: 'syaika@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.syaika'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Syaika Syuhda Suganda'}, function (err, std) {
                User.find({name: "Syaika's Parent"}, function (err, prn) {
                    if (!prn) {console.log("err"); return false};

                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'Toddler'}, function (err, cls) {
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
        name: 'Abdullah Rasyiqul Abid',
        email: 'student.abdullah@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.abdullah'
    }, {
        provider: 'local',        
        name: "Rasyiq's Parent",
        email: 'rasyiq@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.rasyiq'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Abdullah Rasyiqul Abid'}, function (err, std) {
                User.find({name: "Rasyiq's Parent"}, function (err, prn) {
                    if (!prn) {console.log("err"); return false};

                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'Toddler'}, function (err, cls) {
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
        name: 'Alexey Setya Darmawan',
        email: 'student.alexey@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.alexey'
    }, {
        provider: 'local',        
        name: 'Irina Aueriyanova',
        email: 'alexey@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.alexey'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Alexey Setya Darmawan'}, function (err, std) {
                User.find({name: 'Irina Aueriyanova'}, function (err, prn) {
                    std[0]._parent = mongoose   .Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
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
        name: 'Audrey Ardelia Puspa',
        email: 'student.audrey@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.audrey'
    }, {
        provider: 'local',        
        name: 'Grace Puspasari',
        email: 'audrey@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.audrey'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Audrey Ardelia Puspa'}, function (err, std) {
                User.find({name: 'Grace Puspasari'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
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
        name: 'Azzaren Taaza Pangsumadi',
        email: 'student.azzaran@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.azzaran'
    }, {
        provider: 'local',        
        name: 'Irrisa Rosyid',
        email: 'azza@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.azza'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Azzaren Taaza Pangsumadi'}, function (err, std) {
                User.find({name: 'Irrisa Rosyid'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'Bayi'}, function (err, cls) {
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
        name: 'Shanaya Neema Alzire',
        email: 'student.shanaya@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.shanaya'
    }, {
        provider: 'local',        
        name: "Neema's Parent",
        email: 'neema@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.neema'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Shanaya Neema Alzire'}, function (err, std) {
                User.find({name: "Neema's Parent"}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'Bayi'}, function (err, cls) {
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
        name: 'Cleo Adriani Jill Kristen Silaban',
        email: 'student.cleo@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.cleo'
    }, {
        provider: 'local',        
        name: 'Juli Ance Sibajat',
        email: 'cleo@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.cleo'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Cleo Adriani Jill Kristen Silaban'}, function (err, std) {
                User.find({name: 'Juli Ance Sibajat'}, function (err, prn) {
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
        name: 'Dastan Pranaja A.Radhya',
        email: 'student.dastan@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.dastan'
    }, {
        provider: 'local',        
        name: 'Septyani P Putri',
        email: 'dastan@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.dastan'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Dastan Pranaja A.Radhya'}, function (err, std) {
                User.find({name: 'Septyani P Putri'}, function (err, prn) {
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
        name: 'Giftan Aqila Virendra',
        email: 'student.giftan@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.giftan'
    }, {
        provider: 'local',        
        name: 'Nuri Husna',
        email: 'giftan@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.giftan'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Giftan Aqila Virendra'}, function (err, std) {
                User.find({name: 'Nuri Husna'}, function (err, prn) {
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
        name: 'Hadranura Mahadirga Azlan Harahap',
        email: 'student.hadranura@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.hadranura'
    }, {
        provider: 'local',        
        name: 'Sarah Asriyani',
        email: 'dirga@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.dirga'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Hadranura Mahadirga Azlan Harahap'}, function (err, std) {
                User.find({name: 'Sarah Asriyani'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student = mongoose.Types.ObjectId(std[0]._id);
                    prn[0].save();
                });

                Classd.find({name: 'Toddler'}, function (err, cls) {
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
        name: 'Kaleen Nadindra Baruna',
        email: 'student.kaleen@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.kaleen'
    }, {
        provider: 'local',        
        name: 'Melati Astri Maharani',
        email: 'kaleen@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.kaleen'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Kaleen Nadindra Baruna'}, function (err, std) {
                User.find({name: 'Melati Astri Maharani'}, function (err, prn) {
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
        name: 'Karl Theodore Budhi',
        email: 'student.karl@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.karl'
    }, {
        provider: 'local',        
        name: 'Aprilia Grace Sweetasari',
        email: 'karl@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.karl'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Karl Theodore Budhi'}, function (err, std) {
                User.find({name: 'Aprilia Grace Sweetasari'}, function (err, prn) {
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
        name: 'Khansa Tabina Subhan',
        email: 'student.khansa@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.khansa'
    }, {
        provider: 'local',        
        name: 'Yenny Rachmawati',
        email: 'khansa@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.khansa'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Khansa Tabina Subhan'}, function (err, std) {
                User.find({name: 'Yenny Rachmawati'}, function (err, prn) {
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
        name: 'M Faza Aqasyah',
        email: 'student.faza@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.faza'
    }, {
        provider: 'local',        
        name: 'Sendra Ayu Prinastuti',
        email: 'faza@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.faza'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'M Faza Aqasyah'}, function (err, std) {
                User.find({name: 'Sendra Ayu Prinastuti'}, function (err, prn) {
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
        name: 'M Rajendra Farras Atari',
        email: 'student.rajendra@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.rajendra'
    }, {
        provider: 'local',        
        name: 'Riana Sary Aditya',
        email: 'farras@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.farras'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'M Rajendra Farras Atari'}, function (err, std) {
                User.find({name: 'Riana Sary Aditya'}, function (err, prn) {
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

    // User.create([{
    //     provider: 'local',        
    //     name: 'Olivia Gabrielle Thomas',
    //     email: 'student.olivia@kidzpotentia.sch.id',
    //     role: 'student',
    //     password: 'student.olivia'
    // }, {
    //     provider: 'local',        
    //     name: 'Leiny Riutsiara',
    //     email: 'olivia.gabrielle@kidzpotentia.sch.id',
    //     role: 'parent',
    //     password: 'parent.olivia'
    // }] , function (err) {
    //     setTimeout(function () {
    //         User.find({name: 'Olivia Gabrielle Thomas'}, function (err, std) {
    //             User.find({name: 'Leiny Riutsiara'}, function (err, prn) {
    //                 std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
    //                 std[0].save();

    //                 prn[0]._student = mongoose.Types.ObjectId(std[0]._id);
    //                 prn[0].save();
    //             });

    //             Classd.find({name: 'Toddler'}, function (err, cls) {
    //                 std[0]._class = mongoose.Types.ObjectId(cls[0]._id);
    //                 std[0].save();

    //                 cls[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
    //                 cls[0].save(); 
    //             });
    //         });
    //     },500);
    // });

    User.create([{
        provider: 'local',        
        name: 'Renata Khair Nakhla',
        email: 'student.renata@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.renata'
    }, {
        provider: 'local',        
        name: 'Riri Adriana',
        email: 'renata.khair@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.renata'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Renata Khair Nakhla'}, function (err, std) {
                User.find({name: 'Riri Adriana'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student = mongoose.Types.ObjectId(std[0]._id);
                    prn[0].save();
                });

                Classd.find({name: 'Toddler'}, function (err, cls) {
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
        name: 'Ruby Pratama Sutjo',
        email: 'student.ruby@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.ruby'
    }, {
        provider: 'local',        
        name: 'Susi Meilani',
        email: 'ruby@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.ruby'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Ruby Pratama Sutjo'}, function (err, std) {
                User.find({name: 'Susi Meilani'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
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
                        name: 'Elvi',
                        email: 'elvi@kidzpotentia.sch.id',
                        role: 'teacher',
                        password: 'teacher.elvi',
                        _class: toddler._id
                    }, {
                        provider: 'local',        
                        name: 'Debi',
                        email: 'debi@kidzpotentia.sch.id',
                        role: 'teacher',
                        password: 'teacher.debi',
                        _class: bayi._id
                    }, {
                        provider: 'local',        
                        name: 'Ria',
                        email: 'ria@kidzpotentia.sch.id',
                        role: 'teacher',
                        password: 'teacher.ria',
                        _class: playgroup._id
                    }, {
                        provider: 'local',        
                        name: 'Myta',
                        email: 'myta@kidzpotentia.sch.id',
                        role: 'teacher',
                        password: 'teacher.myta',
                        _class: id
                    }, {
                        provider: 'local',        
                        name: 'Anggi',
                        email: 'anggi@kidzpotentia.sch.id',
                        role: 'teacher',
                        password: 'teacher.anggi',
                        _class: id
                    }, {
                        provider: 'local',        
                        name: 'Ade',
                        email: 'ade@kidzpotentia.sch.id',
                        role: 'teacher',
                        password: 'teacher.ade',
                        _class: id
                    }, {
                        provider: 'local',
                        name: 'Suhendar',
                        email: 'suhendar@kidzpotentia.sch.id',
                        role: 'teacher',
                        password: 'teacher.suhendar',
                        _class: id
                    }, {
                        provider: 'local',        
                        name: 'Titin',
                        email: 'titin@kidzpotentia.sch.id',
                        role: 'teacher',
                        password: 'teacher.titin',
                        _class: toddler._id
                    }, {
                        provider: 'local',        
                        name: 'Fitri',
                        email: 'fitri@kidzpotentia.sch.id',
                        role: 'teacher',
                        password: 'teacher.fitri',
                        _class: toddler._id
                    }, {
                        provider: 'local',        
                        name: 'Denia',
                        email: 'denia@kidzpotentia.sch.id',
                        role: 'teacher',
                        password: 'teacher.denia',
                        _class: playgroup._id
                    }, {
                        provider: 'local',        
                        name: 'Dinni',
                        email: 'dinni@kidzpotentia.sch.id',
                        role: 'teacher',
                        password: 'teacher.dinni',
                        _class: id
                    }, {
                        provider: 'local',        
                        name: 'Admin',
                        email: 'admin@kidzpotentia.sch.id',
                        role: 'teacher',
                        password: 'teacher.admin',
                        _class: id
                    }, {
                        provider: 'local',        
                        name: 'Admin App',
                        email: 'admin@admin.com',
                        role: 'admin',
                        password: 'admin',
                        _class: id
                    }], function (err) {
                                                
                    });
                });
            });
        })
    },1000);

    setTimeout(function (argument) {
        School.findOne({name: 'Kidz Potentia'}).exec(function (err, school) {
            User.create({
                provider: 'local',        
                name: 'Moderator Kidz',
                email: 'moderator@kidzpotentia.sch.id',
                role: 'moderator',
                password: 'moderator',
                _school: school._id
            });
        });
    }, 2000);

    setTimeout(function (argument) {
        var teacherTodler = ['elvi@kidzpotentia.sch.id', 
                            'myta@kidzpotentia.sch.id',
                            'anggi@kidzpotentia.sch.id', 
                            'ade@kidzpotentia.sch.id', 
                            'suhendar@kidzpotentia.sch.id', 
                            'titin@kidzpotentia.sch.id', 
                            'fitri@kidzpotentia.sch.id', 
                            'admin@admin.com'];
        var teacherBayi = ['debi@kidzpotentia.sch.id'];
        var teacherPlaygroup = ['denia@kidzpotentia.sch.id'];
        User.find({'email': {$in: teacherTodler}}).exec(function (err, tcr) {
            var t = _.pluck(tcr, "_id");
            Classd.update({name: 'Toddler'}, {$pushAll: {_teacher: t}}, {multi:true}, function (err, ok) {
                console.log(ok)
            });
        })

        User.find({'email': {$in: teacherBayi}}).exec(function (err, tcr) {
            var t = _.pluck(tcr, "_id");
            Classd.update({name: 'Bayi'}, {$pushAll: {_teacher: t}}, {multi:true}, function (err, ok) {
                console.log(ok)
            });
        })

        User.find({'email': {$in: teacherPlaygroup}}).exec(function (err, tcr) {
            var t = _.pluck(tcr, "_id");
            Classd.update({name: 'Playgroup'}, {$pushAll: {_teacher: t}}, {multi:true}, function (err, ok) {
                console.log(ok)
            });
        })
    }, 4000);

    setTimeout(function (argument) {
        Group.find({}).remove(function() {
            var management = ['ade@kidzpotentia.sch.id','suhendar@kidzpotentia.sch.id','selly@kidzpotentia.sch.id'];
            var teachername = ['ade@kidzpotentia.sch.id',
                                'suhendar@kidzpotentia.sch.id',
                                'titin@kidzpotentia.sch.id',
                                'fitri@kidzpotentia.sch.id',
                                'denia@kidzpotentia.sch.id',
                                'elvi@kidzpotentia.sch.id',
                                'debi@kidzpotentia.sch.id',
                                'ria@kidzpotentia.sch.id',
                                'myta@kidzpotentia.sch.id',
                                'anggi@kidzpotentia.sch.id',
                                'admin@kidzpotentia.sch.id',
                                'selly@kidzpotentia.sch.id'];

            Group.create({name:'management'},{name:'teacher'}, function (err, group) {
                
                User.find({email: {$in: management}}).exec(function (err, manager) {
                    var manager_id = _.pluck(manager, '_id');
                    Group.update({name:'management'}, {$pushAll: {_teacher: manager_id}}, {multi: true}, function (err, ok) {
                        console.log('group management updated');
                    });
                })

                User.find({email: {$in: teachername}}).exec(function (err, teacher) {
                    var teacher_id = _.pluck(teacher, '_id');
                    Group.update({name:'teacher'}, {$pushAll: {_teacher: teacher_id}}, {multi: true}, function (err, ok) {
                        console.log('group teacher updated');
                    });
                })

            });
        });

    }, 4000);
});
});


Photo.find({}).remove(function() {
    
});

Story.find({}).remove(function() {

});

Reply.find({}).remove(function() {

});
