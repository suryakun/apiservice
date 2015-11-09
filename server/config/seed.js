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
        name: 'Toddler',
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
        },2000);

        //set relation to school
        setTimeout(function (argument) {
            School.findOne({ name: 'Kidz Potentia'}, function (err, scl) {
                Classd.update({name: 'Toddler' }, { $set: {_school: mongoose.Types.ObjectId(scl._id)} }, {multi:false}, function (err, ok) {
                    console.log(ok)
                })
                
                scl._class.push(cls._id);
                scl.save();
            });
        },2000);

    });    
});

setTimeout(function (argument) {
    User.find({}).remove(function() {

//Student
    User.create([{
        provider: 'local',        
        name: 'Adella Aqila Azka Hartoyo',
        email: 'student.adella.aqila@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.adella'
    }, {
        provider: 'local',        
        name: 'Adyati Pradini Yudison',
        email: 'adella.aqila@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.adella'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Adella Aqila Azka Hartoyo'}, function (err, std) {
                User.find({name: 'Adyati Pradini Yudison'}, function (err, prn) {
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
        name: 'Akiela Putri Arkadian',
        email: 'student.akiela@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.akiela'
    }, {
        provider: 'local',        
        name: 'Mariska Tri Adithia',
        email: 'akiela.putri@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.akiela'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Akiela Putri Arkadian'}, function (err, std) {
                User.find({name: 'Mariska Tri Adithia'}, function (err, prn) {
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
        email: 'alexey.setya@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.alexey'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Alexey Setya Darmawan'}, function (err, std) {
                User.find({name: 'Irina Aueriyanova'}, function (err, prn) {
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
        name: 'Audrey Ardelia Puspa',
        email: 'student.audrey@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.audrey'
    }, {
        provider: 'local',        
        name: 'Grace Puspasari',
        email: 'audrey.ardelia@kidzpotentia.sch.id',
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
        name: 'Azzaren Taaza Pangsumadi',
        email: 'student.azzaran@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.azzaran'
    }, {
        provider: 'local',        
        name: 'Irrisa Rosyid',
        email: 'azzaran.taaza@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.azzaran'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Azzaren Taaza Pangsumadi'}, function (err, std) {
                User.find({name: 'Irrisa Rosyid'}, function (err, prn) {
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
        name: 'Cleo Adriani Jill Kristen Silaban',
        email: 'student.cleo@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.cleo'
    }, {
        provider: 'local',        
        name: 'Juli Ance Sibajat',
        email: 'cleo.adriani@kidzpotentia.sch.id',
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
        name: 'Dastan Pranaja A.Radhya',
        email: 'student.dastan@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.dastan'
    }, {
        provider: 'local',        
        name: 'Septyani P Putri',
        email: 'dastan.pranaja@kidzpotentia.sch.id',
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
        name: 'Giftan Aqila Virendra',
        email: 'student.giftan@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.giftan'
    }, {
        provider: 'local',        
        name: 'Nuri Husna',
        email: 'giftan.aqila@kidzpotentia.sch.id',
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
        name: 'Hadranura Mahadirga Azlan Harahap',
        email: 'student.hadranura@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.hadranura'
    }, {
        provider: 'local',        
        name: 'Sarah Asriyani',
        email: 'hadranura.mahadirga@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.hadranura'
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
        email: 'kaleen.nadindra@kidzpotentia.sch.id',
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
        name: 'Karl Theodore Budhi',
        email: 'student.karl@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.karl'
    }, {
        provider: 'local',        
        name: 'Aprilia Grace Sweetasari',
        email: 'karl.theodore@kidzpotentia.sch.id',
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
        name: 'Khansa Tabina Subhan',
        email: 'student.khansa@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.khansa'
    }, {
        provider: 'local',        
        name: 'Yenny Rachmawati',
        email: 'khansa.tabina@kidzpotentia.sch.id',
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
        name: 'M Faza Aqasyah',
        email: 'student.faza@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.faza'
    }, {
        provider: 'local',        
        name: 'Sendra Ayu Prinastuti',
        email: 'm.faza@kidzpotentia.sch.id',
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
        name: 'M Rajendra Farras Atari',
        email: 'student.rajendra@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.rajendra'
    }, {
        provider: 'local',        
        name: 'Riana Sary Aditya',
        email: 'm.rajendra@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.rajendra'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'M Rajendra Farras Atari'}, function (err, std) {
                User.find({name: 'Riana Sary Aditya'}, function (err, prn) {
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
        name: 'Olivia Gabrielle Thomas',
        email: 'student.olivia@kidzpotentia.sch.id',
        role: 'student',
        password: 'student.olivia'
    }, {
        provider: 'local',        
        name: 'Leiny Riutsiara',
        email: 'olivia.gabrielle@kidzpotentia.sch.id',
        role: 'parent',
        password: 'parent.olivia'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Olivia Gabrielle Thomas'}, function (err, std) {
                User.find({name: 'Leiny Riutsiara'}, function (err, prn) {
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
        email: 'ruby.pratama@kidzpotentia.sch.id',
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

                Classd.find({name: 'Toddler'}, function (err, cls) {
                    std[0]._class = mongoose.Types.ObjectId(cls[0]._id);
                    std[0].save();

                    cls[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    cls[0].save(); 
                });
            });
        },500);
    });
    
    setTimeout(function () {
        Classd.find({name: 'Toddler'}, function (err, cls) {
            var id = mongoose.Types.ObjectId(cls[0]._id);
            User.create([{
                provider: 'local',        
                name: 'Elvi',
                email: 'elvi@kidzpotentia.sch.id',
                role: 'teacher',
                password: 'teacher.elvi',
                _class: id
            }, {
                provider: 'local',        
                name: 'Debi',
                email: 'debi@kidzpotentia.sch.id',
                role: 'teacher',
                password: 'teacher.debi',
                _class: id
            }, {
                provider: 'local',        
                name: 'Ria',
                email: 'ria@kidzpotentia.sch.id',
                role: 'teacher',
                password: 'teacher.ria',
                _class: id
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
            }], function (err) {
                
            });
        })
    },1000);

    setTimeout(function (argument) {
        User.find({role: 'teacher'}, function (err, teacher) {
            _.each(teacher, function (teach, index) {
                Classd.update({name: 'Toddler'}, {$push : {'_teacher': mongoose.Types.ObjectId(teach._id)}}, {multi: true}, function (err, tc) {
                    console.log(tc);
                });
            });
        });

        Classd.find({name: 'Toddler'}, function (err, cls) {
            User.update({role: 'student'}, {$set : {'_class': mongoose.Types.ObjectId(cls[0]._id)}}, {multi: true}, function (err, tc) {
                console.log(tc);
            });
        });
    }, 3000);


});
})

Classd.find({}).remove(function (argument) {
    // body...
})

Photo.find({}).remove(function() {
    
});

Story.find({}).remove(function() {

});

Reply.find({}).remove(function() {

});
