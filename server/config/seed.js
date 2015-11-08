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
        name: 'Bunga Matahari',
        info: 'Kelas Bunga Matahari',
        active: true
    }, function () {

        //set relation to level
        setTimeout(function (argument) {
            Level.findOne({ grade: 'nol kecil'}, function (err, level) {
                Classd.findOne({name: 'Bunga Matahari'}, function (err, cls) {
                    cls._level = level._id;
                    cls.save();

                    level._class.push(cls._id);
                    level.save();
                });
            });
        },1000);

        //set relation to school
        setTimeout(function (argument) {
            School.findOne({ name: 'PG Tirta jasa 2'}, function (err, scl) {
                Classd.findOne({name: 'Bunga Matahari'}, function (err, cls) {
                    cls._school = scl._id;                
                    cls.save();

                    scl._class.push(cls._id);
                    scl.save();
                });
            });
        },1100);

    });

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
        },1000);

        //set relation to school
        setTimeout(function (argument) {
            School.findOne({ name: 'Kidz Potentia'}, function (err, scl) {
                cls._school = scl._id;                
                cls.save();

                scl._class.push(cls._id);
                scl.save();
            });
        },1100);

    });    
});

User.find({}).remove(function() {

//Student
    User.create([{
        provider: 'local',        
        name: 'Adella Aqila Azka Hartoyo',
        email: 'student.adella.aqila@kidzpotentia.com',
        role: 'student',
        password: 'student.adella'
    }, {
        provider: 'local',        
        name: 'Adyati Pradini Yudison',
        email: 'adella.aqila@kidzpotentia.com',
        role: 'parent',
        password: 'parent.adella'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Adella Aqila Azka Hartoyo'}, function (err, std) {
                User.find({name: 'Adyati Pradini Yudison'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std._id));
                    prn[0].save();
                });

                Classd.find({name: 'Toddler'}, function (err, cls) {
                    std[0]._class = mongoose.Types.ObjectId(cls._id);
                    std[0].save();

                    cls[0]._student.push(mongoose.Types.ObjectId(std._id));
                    cls[0].save(); 
                });
            });
        },500);
    });

    User.create([{
        provider: 'local',        
        name: 'Akiela Putri Arkadian',
        email: 'student.akiela@kidzpotentia.com',
        role: 'student',
        password: 'student.akiela'
    }, {
        provider: 'local',        
        name: 'Mariska Tri Adithia',
        email: 'akiela.putri@kidzpotentia.com',
        role: 'parent',
        password: 'parent.akiela'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Akiela Putri Arkadian'}, function (err, std) {
                User.find({name: 'Mariska Tri Adithia'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std._id));
                    prn[0].save();
                });

                Classd.find({name: 'Toddler'}, function (err, cls) {
                    std[0]._class = mongoose.Types.ObjectId(cls._id);
                    std[0].save();

                    cls[0]._student.push(mongoose.Types.ObjectId(std._id));
                    cls[0].save(); 
                });
            });
        },500);
    });

    User.create([{
        provider: 'local',        
        name: 'Alexey Setya Darmawan',
        email: 'student.alexey@kidzpotentia.com',
        role: 'student',
        password: 'student.alexey'
    }, {
        provider: 'local',        
        name: 'Irina Aueriyanova',
        email: 'alexey.setya@kidzpotentia.com',
        role: 'parent',
        password: 'parent.alexey'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Alexey Setya Darmawan'}, function (err, std) {
                User.find({name: 'Irina Aueriyanova'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std._id));
                    prn[0].save();
                });

                Classd.find({name: 'Toddler'}, function (err, cls) {
                    std[0]._class = mongoose.Types.ObjectId(cls._id);
                    std[0].save();

                    cls[0]._student.push(mongoose.Types.ObjectId(std._id));
                    cls[0].save(); 
                });
            });
        },500);
    });

    User.create([{
        provider: 'local',        
        name: 'Audrey Ardelia Puspa',
        email: 'student.audrey@kidzpotentia.com',
        role: 'student',
        password: 'student.audrey'
    }, {
        provider: 'local',        
        name: 'Grace Puspasari',
        email: 'audrey.ardelia@kidzpotentia.com',
        role: 'parent',
        password: 'parent.audrey'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Audrey Ardelia Puspa'}, function (err, std) {
                User.find({name: 'Grace Puspasari'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std._id));
                    prn[0].save();
                });

                Classd.find({name: 'Toddler'}, function (err, cls) {
                    std[0]._class = mongoose.Types.ObjectId(cls._id);
                    std[0].save();

                    cls[0]._student.push(mongoose.Types.ObjectId(std._id));
                    cls[0].save(); 
                });
            });
        },500);
    });

    User.create([{
        provider: 'local',        
        name: 'Azzaren Taaza Pangsumadi',
        email: 'student.azzaran@kidzpotentia.com',
        role: 'student',
        password: 'student.azzaran'
    }, {
        provider: 'local',        
        name: 'Irrisa Rosyid',
        email: 'azzaran.taaza@kidzpotentia.com',
        role: 'parent',
        password: 'parent.azzaran'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Azzaren Taaza Pangsumadi'}, function (err, std) {
                User.find({name: 'Irrisa Rosyid'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std._id));
                    prn[0].save();
                });

                Classd.find({name: 'Toddler'}, function (err, cls) {
                    std[0]._class = mongoose.Types.ObjectId(cls._id);
                    std[0].save();

                    cls[0]._student.push(mongoose.Types.ObjectId(std._id));
                    cls[0].save(); 
                });
            });
        },500);
    });

    User.create([{
        provider: 'local',        
        name: 'Cleo Adriani Jill Kristen Silaban',
        email: 'student.cleo@kidzpotentia.com',
        role: 'student',
        password: 'student.cleo'
    }, {
        provider: 'local',        
        name: 'Juli Ance Sibajat',
        email: 'cleo.adriani@kidzpotentia.com',
        role: 'parent',
        password: 'parent.cleo'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Cleo Adriani Jill Kristen Silaban'}, function (err, std) {
                User.find({name: 'Juli Ance Sibajat'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std._id));
                    prn[0].save();
                });

                Classd.find({name: 'Toddler'}, function (err, cls) {
                    std[0]._class = mongoose.Types.ObjectId(cls._id);
                    std[0].save();

                    cls[0]._student.push(mongoose.Types.ObjectId(std._id));
                    cls[0].save(); 
                });
            });
        },500);
    });

    User.create([{
        provider: 'local',        
        name: 'Dastan Pranaja A.Radhya',
        email: 'student.dastan@kidzpotentia.com',
        role: 'student',
        password: 'student.dastan'
    }, {
        provider: 'local',        
        name: 'Septyani P Putri',
        email: 'dastan.pranaja@kidzpotentia.com',
        role: 'parent',
        password: 'parent.dastan'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Dastan Pranaja A.Radhya'}, function (err, std) {
                User.find({name: 'Septyani P Putri'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std._id));
                    prn[0].save();
                });

                Classd.find({name: 'Toddler'}, function (err, cls) {
                    std[0]._class = mongoose.Types.ObjectId(cls._id);
                    std[0].save();

                    cls[0]._student.push(mongoose.Types.ObjectId(std._id));
                    cls[0].save(); 
                });
            });
        },500);
    });

    User.create([{
        provider: 'local',        
        name: 'Giftan Aqila Virendra',
        email: 'student.giftan@kidzpotentia.com',
        role: 'student',
        password: 'student.giftan'
    }, {
        provider: 'local',        
        name: 'Nuri Husna',
        email: 'giftan.aqila@kidzpotentia.com',
        role: 'parent',
        password: 'parent.giftan'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Giftan Aqila Virendra'}, function (err, std) {
                User.find({name: 'Nuri Husna'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std._id));
                    prn[0].save();
                });

                Classd.find({name: 'Toddler'}, function (err, cls) {
                    std[0]._class = mongoose.Types.ObjectId(cls._id);
                    std[0].save();

                    cls[0]._student.push(mongoose.Types.ObjectId(std._id));
                    cls[0].save(); 
                });
            });
        },500);
    });

    User.create([{
        provider: 'local',        
        name: 'Hadranura Mahadirga Azlan Harahap',
        email: 'student.hadranura@kidzpotentia.com',
        role: 'student',
        password: 'student.hadranura'
    }, {
        provider: 'local',        
        name: 'Sarah Asriyani',
        email: 'hadranura.mahadirga@kidzpotentia.com',
        role: 'parent',
        password: 'parent.hadranura'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Hadranura Mahadirga Azlan Harahap'}, function (err, std) {
                User.find({name: 'Sarah Asriyani'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std._id));
                    prn[0].save();
                });

                Classd.find({name: 'Toddler'}, function (err, cls) {
                    std[0]._class = mongoose.Types.ObjectId(cls._id);
                    std[0].save();

                    cls[0]._student.push(mongoose.Types.ObjectId(std._id));
                    cls[0].save(); 
                });
            });
        },500);
    });

    User.create([{
        provider: 'local',        
        name: 'Kaleen Nadindra Baruna',
        email: 'student.kaleen@kidzpotentia.com',
        role: 'student',
        password: 'student.kaleen'
    }, {
        provider: 'local',        
        name: 'Melati Astri Maharani',
        email: 'kaleen.nadindra@kidzpotentia.com',
        role: 'parent',
        password: 'parent.kaleen'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Kaleen Nadindra Baruna'}, function (err, std) {
                User.find({name: 'Melati Astri Maharani'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std._id));
                    prn[0].save();
                });

                Classd.find({name: 'Toddler'}, function (err, cls) {
                    std[0]._class = mongoose.Types.ObjectId(cls._id);
                    std[0].save();

                    cls[0]._student.push(mongoose.Types.ObjectId(std._id));
                    cls[0].save(); 
                });
            });
        },500);
    });

    User.create([{
        provider: 'local',        
        name: 'Karl Theodore Budhi',
        email: 'student.karl@kidzpotentia.com',
        role: 'student',
        password: 'student.karl'
    }, {
        provider: 'local',        
        name: 'Aprilia Grace Sweetasari',
        email: 'karl.theodore@kidzpotentia.com',
        role: 'parent',
        password: 'parent.karl'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Karl Theodore Budhi'}, function (err, std) {
                User.find({name: 'Aprilia Grace Sweetasari'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std._id));
                    prn[0].save();
                });

                Classd.find({name: 'Toddler'}, function (err, cls) {
                    std[0]._class = mongoose.Types.ObjectId(cls._id);
                    std[0].save();

                    cls[0]._student.push(mongoose.Types.ObjectId(std._id));
                    cls[0].save(); 
                });
            });
        },500);
    });

    User.create([{
        provider: 'local',        
        name: 'Khansa Tabina Subhan',
        email: 'student.khansa@kidzpotentia.com',
        role: 'student',
        password: 'student.khansa'
    }, {
        provider: 'local',        
        name: 'Yenny Rachmawati',
        email: 'khansa.tabina@kidzpotentia.com',
        role: 'parent',
        password: 'parent.khansa'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Khansa Tabina Subhan'}, function (err, std) {
                User.find({name: 'Yenny Rachmawati'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std._id));
                    prn[0].save();
                });

                Classd.find({name: 'Toddler'}, function (err, cls) {
                    std[0]._class = mongoose.Types.ObjectId(cls._id);
                    std[0].save();

                    cls[0]._student.push(mongoose.Types.ObjectId(std._id));
                    cls[0].save(); 
                });
            });
        },500);
    });

    User.create([{
        provider: 'local',        
        name: 'M Faza Aqasyah',
        email: 'student.faza@kidzpotentia.com',
        role: 'student',
        password: 'student.faza'
    }, {
        provider: 'local',        
        name: 'Sendra Ayu Prinastuti',
        email: 'm.faza@kidzpotentia.com',
        role: 'parent',
        password: 'parent.faza'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'M Faza Aqasyah'}, function (err, std) {
                User.find({name: 'Sendra Ayu Prinastuti'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std._id));
                    prn[0].save();
                });

                Classd.find({name: 'Toddler'}, function (err, cls) {
                    std[0]._class = mongoose.Types.ObjectId(cls._id);
                    std[0].save();

                    cls[0]._student.push(mongoose.Types.ObjectId(std._id));
                    cls[0].save(); 
                });
            });
        },500);
    });

    User.create([{
        provider: 'local',        
        name: 'M Rajendra Farras Atari',
        email: 'student.rajendra@kidzpotentia.com',
        role: 'student',
        password: 'student.rajendra'
    }, {
        provider: 'local',        
        name: 'Riana Sary Aditya',
        email: 'm.rajendra@kidzpotentia.com',
        role: 'parent',
        password: 'parent.rajendra'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'M Rajendra Farras Atari'}, function (err, std) {
                User.find({name: 'Riana Sary Aditya'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std._id));
                    prn[0].save();
                });

                Classd.find({name: 'Toddler'}, function (err, cls) {
                    std[0]._class = mongoose.Types.ObjectId(cls._id);
                    std[0].save();

                    cls[0]._student.push(mongoose.Types.ObjectId(std._id));
                    cls[0].save(); 
                });
            });
        },500);
    });

    User.create([{
        provider: 'local',        
        name: 'Olivia Gabrielle Thomas',
        email: 'student.olivia@kidzpotentia.com',
        role: 'student',
        password: 'student.olivia'
    }, {
        provider: 'local',        
        name: 'Leiny Riutsiara',
        email: 'olivia.gabrielle@kidzpotentia.com',
        role: 'parent',
        password: 'parent.olivia'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Olivia Gabrielle Thomas'}, function (err, std) {
                User.find({name: 'Leiny Riutsiara'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std._id));
                    prn[0].save();
                });

                Classd.find({name: 'Toddler'}, function (err, cls) {
                    std[0]._class = mongoose.Types.ObjectId(cls._id);
                    std[0].save();

                    cls[0]._student.push(mongoose.Types.ObjectId(std._id));
                    cls[0].save(); 
                });
            });
        },500);
    });

    User.create([{
        provider: 'local',        
        name: 'Renata Khair Nakhla',
        email: 'student.renata@kidzpotentia.com',
        role: 'student',
        password: 'student.renata'
    }, {
        provider: 'local',        
        name: 'Riri Adriana',
        email: 'renata.khair@kidzpotentia.com',
        role: 'parent',
        password: 'parent.renata'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Renata Khair Nakhla'}, function (err, std) {
                User.find({name: 'Riri Adriana'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std._id));
                    prn[0].save();
                });

                Classd.find({name: 'Toddler'}, function (err, cls) {
                    std[0]._class = mongoose.Types.ObjectId(cls._id);
                    std[0].save();

                    cls[0]._student.push(mongoose.Types.ObjectId(std._id));
                    cls[0].save(); 
                });
            });
        },500);
    });

    User.create([{
        provider: 'local',        
        name: 'Ruby Pratama Sutjo',
        email: 'student.ruby@kidzpotentia.com',
        role: 'student',
        password: 'student.ruby'
    }, {
        provider: 'local',        
        name: 'Susi Meilani',
        email: 'ruby.pratama@kidzpotentia.com',
        role: 'parent',
        password: 'parent.ruby'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Ruby Pratama Sutjo'}, function (err, std) {
                User.find({name: 'Susi Meilani'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std._id));
                    prn[0].save();
                });

                Classd.find({name: 'Toddler'}, function (err, cls) {
                    std[0]._class = mongoose.Types.ObjectId(cls._id);
                    std[0].save();

                    cls[0]._student.push(mongoose.Types.ObjectId(std._id));
                    cls[0].save(); 
                });
            });
        },500);
    });


});

Photo.find({}).remove(function() {
    
});

Story.find({}).remove(function() {

});

Reply.find({}).remove(function() {

});
