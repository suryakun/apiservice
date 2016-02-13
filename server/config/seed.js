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

    Foundation.create({
        _school: [],
        name: 'Pandu',
        address: '',
        phone: '',
        owner: '',
        active: true
    }, function() {
        setTimeout(function (argument) {
            School.findOne({ name: 'Pandu' }, function (err, school) {
                Foundation.findOne({ name: 'Pandu'}, function (err, found) {
                    found._school.push(school._id);
                    found.save();
                });
            });
        }, 1000);
        console.log('finished populating foundation');
    });

    School.create({
        address: 'Bandung',
        phone: '',
        principal: '',
        name: 'Pandu',
        info: 'Play Group',
        active: true
    }, function() {
        Foundation.findOne({ name: 'Pandu'}, function (err, found) {
            School.findOne({ name: 'Pandu' }, function (err, school) {
                school._foundation = found._id;
                school.save();
            });
        });

        console.log('finished populating school');
    });    

    setTimeout(function (argument) {
        School.findOne({ name: 'Pandu' }, function (err, school) {
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


    Classd.create({
        name: 'TK A1',
        info: 'Kelas Collection',
        active: true
    },{
        name: 'TK A2',
        info: 'Kelas Collection',
        active: true
    },{
        name: 'TK B1',
        info: 'Kelas Collection',
        active: true
    },{
        name: 'TK B2',
        info: 'Kelas Collection',
        active: true
    },{
        name: 'PG',
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
            School.findOne({ name: 'Pandu'}, function (err, scl) {
                var class_name = ['TK A1','TK A2','TK B1','TK B2','PG'];
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
        },4000);

    });    

setTimeout(function (argument) {

//Student Pandu
    User.create([{
        provider: 'local',
        name: 'Anatasya Renata',
        email: 'student.tasya@pandu.sch.id',
        role: 'student',
        password: 'student.tasya'
    }, {
        provider: 'local',        
        name: 'Wyndu Rynaldo',
        email: 'tasya@pandu.sch.id',
        role: 'parent',
        password: 'parent.tasya'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Anatasya Renata'}, function (err, std) {
                User.find({name: 'Wyndu Rynaldo'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A1'}, function (err, cls) {
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
        name: 'Audrey Christa Aprilive',
        email: 'student.audrey@pandu.sch.id',
        role: 'student',
        password: 'student.audrey'
    }, {
        provider: 'local',        
        name: 'Daniel Saragih',
        email: 'audrey@pandu.sch.id',
        role: 'parent',
        password: 'parent.audrey'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Audrey Christa Aprilive'}, function (err, std) {
                User.find({name: 'Daniel Saragih'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A1'}, function (err, cls) {
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
        name: 'Benecdictus Edward Salim',
        email: 'student.edward@pandu.sch.id',
        role: 'student',
        password: 'student.edward'
    }, {
        provider: 'local',        
        name: 'Fransisca Stephanie',
        email: 'edward@pandu.sch.id',
        role: 'parent',
        password: 'parent.edward'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Benecdictus Edward Salim'}, function (err, std) {
                User.find({name: 'Fransisca Stephanie'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A1'}, function (err, cls) {
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
        name: 'Chester Cleveland Tarsibi',
        email: 'student.chester@pandu.sch.id',
        role: 'student',
        password: 'student.chester'
    }, {
        provider: 'local',        
        name: 'Ivan Stephen',
        email: 'chester@pandu.sch.id',
        role: 'parent',
        password: 'parent.chester'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Chester Cleveland Tarsibi'}, function (err, std) {
                User.find({name: 'Ivan Stephen'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A1'}, function (err, cls) {
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
        name: 'Edgardo Gavriel Purba',
        email: 'student.gardo@pandu.sch.id',
        role: 'student',
        password: 'student.gardo'
    }, {
        provider: 'local',        
        name: 'Suadry Franky',
        email: 'gardo@pandu.sch.id',
        role: 'parent',
        password: 'parent.gardo'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Edgardo Gavriel Purba'}, function (err, std) {
                User.find({name: 'Suadry Franky'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A1'}, function (err, cls) {
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
        name: 'Elisabeth Aurelia Bella',
        email: 'student.aurel@pandu.sch.id',
        role: 'student',
        password: 'student.aurel'
    }, {
        provider: 'local',        
        name: 'Selly Dewi Febianti',
        email: 'aurel@pandu.sch.id',
        role: 'parent',
        password: 'parent.aurel'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Elisabeth Aurelia Bella'}, function (err, std) {
                User.find({name: 'Selly Dewi Febianti'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A1'}, function (err, cls) {
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
        name: 'Hedia Dahayu Winarno',
        email: 'student.hedia@pandu.sch.id',
        role: 'student',
        password: 'student.aurel'
    }, {
        provider: 'local',        
        name: 'Teguh Winarno',
        email: 'hedia@pandu.sch.id',
        role: 'parent',
        password: 'parent.hedia'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Hedia Dahayu Winarno'}, function (err, std) {
                User.find({name: 'Teguh Winarno'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A1'}, function (err, cls) {
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
        name: 'Jean Alysa Laksmi',
        email: 'student.jean@pandu.sch.id',
        role: 'student',
        password: 'student.jean'
    }, {
        provider: 'local',        
        name: 'Hari Kristianto',
        email: 'jean@pandu.sch.id',
        role: 'parent',
        password: 'parent.jean'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Jean Alysa Laksmi'}, function (err, std) {
                User.find({name: 'Hari Kristianto'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A1'}, function (err, cls) {
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
        name: 'Kenneth Carton',
        email: 'student.kenken@pandu.sch.id',
        role: 'student',
        password: 'student.kenken'
    }, {
        provider: 'local',        
        name: 'Yen Kay',
        email: 'kenken@pandu.sch.id',
        role: 'parent',
        password: 'parent.kenken'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Kenneth Carton'}, function (err, std) {
                User.find({name: 'Yen Kay'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A1'}, function (err, cls) {
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
        name: 'Kevin Suryadi',
        email: 'student.kevin@pandu.sch.id',
        role: 'student',
        password: 'student.kevin'
    }, {
        provider: 'local',        
        name: 'Iwan Suryadi',
        email: 'kevin@pandu.sch.id',
        role: 'parent',
        password: 'parent.kevin'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Kevin Suryadi'}, function (err, std) {
                User.find({name: 'Iwan Suryadi'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A1'}, function (err, cls) {
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
        name: 'Kyriel Abram Mahardika',
        email: 'student.abi@pandu.sch.id',
        role: 'student',
        password: 'student.abi'
    }, {
        provider: 'local',        
        name: 'Lily C. Tandililing',
        email: 'abi@pandu.sch.id',
        role: 'parent',
        password: 'parent.abi'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Kyriel Abram Mahardika'}, function (err, std) {
                User.find({name: 'Lily C. Tandililing'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A1'}, function (err, cls) {
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
        name: 'Levi Ganendra Yuganta',
        email: 'student.levi@pandu.sch.id',
        role: 'student',
        password: 'student.levi'
    }, {
        provider: 'local',        
        name: 'Panji Yudha',
        email: 'levi@pandu.sch.id',
        role: 'parent',
        password: 'parent.levi'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Levi Ganendra Yuganta'}, function (err, std) {
                User.find({name: 'Panji Yudha'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A1'}, function (err, cls) {
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
        name: 'Mutiara Butar Butar',
        email: 'student.mutiara@pandu.sch.id',
        role: 'student',
        password: 'student.mutiara'
    }, {
        provider: 'local',        
        name: 'M. Butar Butar',
        email: 'mutiara@pandu.sch.id',
        role: 'parent',
        password: 'parent.mutiara'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Mutiara Butar Butar'}, function (err, std) {
                User.find({name: 'M. Butar Butar'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A1'}, function (err, cls) {
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
        name: 'Timotius Maruli Putra Husahoit',
        email: 'student.timo@pandu.sch.id',
        role: 'student',
        password: 'student.timo'
    }, {
        provider: 'local',        
        name: 'Landosor',
        email: 'timo@pandu.sch.id',
        role: 'parent',
        password: 'parent.timo'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Timotius Maruli Putra Husahoit'}, function (err, std) {
                User.find({name: 'Landosor'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A1'}, function (err, cls) {
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
        name: 'Yosephine Ivana Martiningsih',
        email: 'student.ivana@pandu.sch.id',
        role: 'student',
        password: 'student.ivana'
    }, {
        provider: 'local',        
        name: 'Fransiscus Xaverius',
        email: 'ivana@pandu.sch.id',
        role: 'parent',
        password: 'parent.ivana'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Yosephine Ivana Martiningsih'}, function (err, std) {
                User.find({name: 'Fransiscus Xaverius'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A1'}, function (err, cls) {
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
        name: 'Zeyd Abraham Noya Ramdhan',
        email: 'student.am@pandu.sch.id',
        role: 'student',
        password: 'student.am'
    }, {
        provider: 'local',        
        name: 'Anna S. Nova',
        email: 'am@pandu.sch.id',
        role: 'parent',
        password: 'parent.am'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Zeyd Abraham Noya Ramdhan'}, function (err, std) {
                User.find({name: 'Anna S. Nova'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A1'}, function (err, cls) {
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
        name: 'Zeyd Abraham Noya Ramdhan',
        email: 'student.am@pandu.sch.id',
        role: 'student',
        password: 'student.am'
    }, {
        provider: 'local',        
        name: 'Anna S. Nova',
        email: 'am@pandu.sch.id',
        role: 'parent',
        password: 'parent.am'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Zeyd Abraham Noya Ramdhan'}, function (err, std) {
                User.find({name: 'Anna S. Nova'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A1'}, function (err, cls) {
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
        name: 'Kevin Marcello',
        email: 'student.kevin.marcello@pandu.sch.id',
        role: 'student',
        password: 'student.kevin'
    }, {
        provider: 'local',        
        name: 'Danny Djuhadi',
        email: 'kevin.marcello@pandu.sch.id',
        role: 'parent',
        password: 'parent.kevin'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Kevin Marcello'}, function (err, std) {
                User.find({name: 'Danny Djuhadi'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A1'}, function (err, cls) {
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
        name: 'Adam Januar Cahyadi',
        email: 'student.adam@pandu.sch.id',
        role: 'student',
        password: 'student.adam'
    }, {
        provider: 'local',        
        name: 'Harry Fajar',
        email: 'adam@pandu.sch.id',
        role: 'parent',
        password: 'parent.adam'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Adam Januar Cahyadi'}, function (err, std) {
                User.find({name: 'Harry Fajar'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A2'}, function (err, cls) {
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
        name: 'Alvio Christiano',
        email: 'student.alvio@pandu.sch.id',
        role: 'student',
        password: 'student.alvio'
    }, {
        provider: 'local',        
        name: 'Lidiawati',
        email: 'alvio@pandu.sch.id',
        role: 'parent',
        password: 'parent.alvio'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Alvio Christiano'}, function (err, std) {
                User.find({name: 'Lidiawati'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A2'}, function (err, cls) {
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
        name: 'Aurora Shaeroneva Purba',
        email: 'student.aurora@pandu.sch.id',
        role: 'student',
        password: 'student.aurora'
    }, {
        provider: 'local',        
        name: 'Alfred P. Purba',
        email: 'aurora@pandu.sch.id',
        role: 'parent',
        password: 'parent.aurora'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Aurora Shaeroneva Purba'}, function (err, std) {
                User.find({name: 'Alfred P. Purba'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A2'}, function (err, cls) {
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
        name: 'Bagas Santo Imanuel Sihite',
        email: 'student.bagas@pandu.sch.id',
        role: 'student',
        password: 'student.bagas'
    }, {
        provider: 'local',        
        name: 'Briston Sihite',
        email: 'bagas@pandu.sch.id',
        role: 'parent',
        password: 'parent.bagas'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Bagas Santo Imanuel Sihite'}, function (err, std) {
                User.find({name: 'Briston Sihite'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A2'}, function (err, cls) {
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
        name: 'Christian Chicharito W',
        email: 'student.chris@pandu.sch.id',
        role: 'student',
        password: 'student.chris'
    }, {
        provider: 'local',        
        name: 'Kadir',
        email: 'chris@pandu.sch.id',
        role: 'parent',
        password: 'parent.chris'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Christian Chicharito W'}, function (err, std) {
                User.find({name: 'Kadir'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A2'}, function (err, cls) {
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
        name: 'Christa Belle Karren',
        email: 'student.karren@pandu.sch.id',
        role: 'student',
        password: 'student.karren'
    }, {
        provider: 'local',        
        name: 'Tutuk Murdana',
        email: 'karren@pandu.sch.id',
        role: 'parent',
        password: 'parent.karren'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Christa Belle Karren'}, function (err, std) {
                User.find({name: 'Tutuk Murdana'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A2'}, function (err, cls) {
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
        name: 'Hanna Santosa',
        email: 'student.hanna@pandu.sch.id',
        role: 'student',
        password: 'student.hanna'
    }, {
        provider: 'local',        
        name: 'Reza Santosa',
        email: 'hanna@pandu.sch.id',
        role: 'parent',
        password: 'parent.hanna'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Hanna Santosa'}, function (err, std) {
                User.find({name: 'Reza Santosa'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A2'}, function (err, cls) {
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
        name: 'Imanuela Mustika Chandra',
        email: 'student.ima@pandu.sch.id',
        role: 'student',
        password: 'student.ima'
    }, {
        provider: 'local',        
        name: 'Mikael Yuda',
        email: 'ima@pandu.sch.id',
        role: 'parent',
        password: 'parent.ima'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Imanuela Mustika Chandra'}, function (err, std) {
                User.find({name: 'Mikael Yuda'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A2'}, function (err, cls) {
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
        name: 'Jonathan Velentino',
        email: 'student.jojo@pandu.sch.id',
        role: 'student',
        password: 'student.jojo'
    }, {
        provider: 'local',        
        name: 'Rikky Sutanto',
        email: 'jojo@pandu.sch.id',
        role: 'parent',
        password: 'parent.jojo'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Jonathan Velentino'}, function (err, std) {
                User.find({name: 'Rikky Sutanto'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A2'}, function (err, cls) {
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
        name: 'Leonita Lolliyanti',
        email: 'student.loli@pandu.sch.id',
        role: 'student',
        password: 'student.loli'
    }, {
        provider: 'local',        
        name: 'Hendrik',
        email: 'loli@pandu.sch.id',
        role: 'parent',
        password: 'parent.loli'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Leonita Lolliyanti'}, function (err, std) {
                User.find({name: 'Hendrik'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A2'}, function (err, cls) {
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
        name: 'Mesya Christiani',
        email: 'student.mesya@pandu.sch.id',
        role: 'student',
        password: 'student.mesya'
    }, {
        provider: 'local',        
        name: 'Andre Budi Hartono',
        email: 'mesya@pandu.sch.id',
        role: 'parent',
        password: 'parent.mesya'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Mesya Christiani'}, function (err, std) {
                User.find({name: 'Andre Budi Hartono'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A2'}, function (err, cls) {
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
        name: 'Patricia Andracallysta',
        email: 'student.calista@pandu.sch.id',
        role: 'student',
        password: 'student.calista'
    }, {
        provider: 'local',        
        name: 'P. Situmorang',
        email: 'calista@pandu.sch.id',
        role: 'parent',
        password: 'parent.calista'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Patricia Andracallysta'}, function (err, std) {
                User.find({name: 'P. Situmorang'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A2'}, function (err, cls) {
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
        name: 'Rafael Andrew',
        email: 'student.andrew@pandu.sch.id',
        role: 'student',
        password: 'student.andrew'
    }, {
        provider: 'local',        
        name: 'Yohanes Rasikun',
        email: 'andrew@pandu.sch.id',
        role: 'parent',
        password: 'parent.andrew'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Rafael Andrew'}, function (err, std) {
                User.find({name: 'Yohanes Rasikun'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A2'}, function (err, cls) {
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
        name: 'Rafael Genta Raya Muda',
        email: 'student.rafael@pandu.sch.id',
        role: 'student',
        password: 'student.rafael'
    }, {
        provider: 'local',        
        name: 'Dominikus K.M',
        email: 'rafael@pandu.sch.id',
        role: 'parent',
        password: 'parent.rafael'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Rafael Genta Raya Muda'}, function (err, std) {
                User.find({name: 'Dominikus K.M'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A2'}, function (err, cls) {
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
        name: 'Sandrina Zhifillia Sutanto',
        email: 'student.zhif@pandu.sch.id',
        role: 'student',
        password: 'student.zhif'
    }, {
        provider: 'local',        
        name: 'Hendy Sutanto',
        email: 'zhif@pandu.sch.id',
        role: 'parent',
        password: 'parent.zhif'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Sandrina Zhifillia Sutanto'}, function (err, std) {
                User.find({name: 'Hendy Sutanto'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A2'}, function (err, cls) {
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
        name: 'Valentino Nathanael',
        email: 'student.valen@pandu.sch.id',
        role: 'student',
        password: 'student.valen'
    }, {
        provider: 'local',        
        name: 'Tony Pudjiantoro',
        email: 'valen@pandu.sch.id',
        role: 'parent',
        password: 'parent.valen'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Valentino Nathanael'}, function (err, std) {
                User.find({name: 'Tony Pudjiantoro'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A2'}, function (err, cls) {
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
        name: 'Vinsensius Hans Kidarsa',
        email: 'student.hans@pandu.sch.id',
        role: 'student',
        password: 'student.hans'
    }, {
        provider: 'local',        
        name: 'Andre Gunarso Kidarsa',
        email: 'hans@pandu.sch.id',
        role: 'parent',
        password: 'parent.hans'
    }] , function (err) {
        setTimeout(function () {
            User.find({name: 'Vinsensius Hans Kidarsa'}, function (err, std) {
                User.find({name: 'Andre Gunarso Kidarsa'}, function (err, prn) {
                    std[0]._parent = mongoose.Types.ObjectId(prn[0]._id);
                    std[0].save();

                    prn[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    prn[0].save();
                });

                Classd.find({name: 'TK A2'}, function (err, cls) {
                    std[0]._class = mongoose.Types.ObjectId(cls[0]._id);
                    std[0].save();

                    cls[0]._student.push(mongoose.Types.ObjectId(std[0]._id));
                    cls[0].save(); 
                });
            });
        },500);
    });

//===== end pandu ==========
    
    setTimeout(function () {
        Classd.findOne({name: 'TK A1'}, function (err, a1) {
            Classd.findOne({name: 'TK A2'}, function (err, a2) {
                Classd.findOne({name: 'TK B1'}, function (err, b1) {
                    Classd.findOne({name: 'TK B2'}, function (err, b2) {
                        Classd.findOne({name: 'PG'}, function (err, pg) {
                            User.create([{
                                provider: 'local',        
                                name: 'Ancilla Anggraeni',
                                email: 'ancilla@pandu.sch.id',
                                role: 'teacher',
                                password: 'teacher.ancillia',
                                _class: ''
                            }, {
                                provider: 'local',        
                                name: 'Desy Febriani',
                                email: 'desy@pandu.sch.id',
                                role: 'teacher',
                                password: 'teacher.desy',
                                _class: b1._id
                            }, {
                                provider: 'local',        
                                name: 'Endang S.R',
                                email: 'endang@pandu.sch.id',
                                role: 'teacher',
                                password: 'teacher.endang',
                                _class: a1._id
                            }, {
                                provider: 'local',        
                                name: 'Maranatha',
                                email: 'maranatha@pandu.sch.id',
                                role: 'teacher',
                                password: 'teacher.maranatha',
                                _class: pg._id
                            }, {
                                provider: 'local',        
                                name: 'Karolina Karnengsih',
                                email: 'karolina@pandu.sch.id',
                                role: 'teacher',
                                password: 'teacher.karolina',
                                _class: b2._id
                            }, {
                                provider: 'local',        
                                name: 'Nengrida Klara Sirait',
                                email: 'rida@pandu.sch.id',
                                role: 'teacher',
                                password: 'teacher.rida',
                                _class: a2._id
                            }], function (err) {
                                                        
                            });
                        });
                    });
                });
            });
        })
    },1000);

    setTimeout(function (argument) {
        School.findOne({name: 'Pandu'}).exec(function (err, school) {
            User.create({
                provider: 'local',        
                name: 'Moderator Pandu',
                email: 'moderator@pandu.sch.id',
                role: 'moderator',
                password: 'moderator',
                _school: school._id
            });
        });
    }, 2000);

    setTimeout(function (argument) {
        var ca1 = ['endang@pandu.sch.id'];
        var ca2 = ['rida@pandu.sch.id'];
        var cb1 = ['desy@pandu.sch.id'];
        var cb2 = ['karolina@pandu.sch.id'];
        var cpg = ['maranatha@pandu.sch.id'];
        
        User.find({'email': {$in: ca1}}).exec(function (err, tcr) {
            var t = _.pluck(tcr, "_id");
            Classd.update({name: 'TK A1'}, {$pushAll: {_teacher: t}}, {multi:true}, function (err, ok) {
                console.log(ok)
            });
        })

        User.find({'email': {$in: ca2}}).exec(function (err, tcr) {
            var t = _.pluck(tcr, "_id");
            Classd.update({name: 'TK A2'}, {$pushAll: {_teacher: t}}, {multi:true}, function (err, ok) {
                console.log(ok)
            });
        })

        User.find({'email': {$in: cb1}}).exec(function (err, tcr) {
            var t = _.pluck(tcr, "_id");
            Classd.update({name: 'TK B1'}, {$pushAll: {_teacher: t}}, {multi:true}, function (err, ok) {
                console.log(ok)
            });
        })

        User.find({'email': {$in: cb2}}).exec(function (err, tcr) {
            var t = _.pluck(tcr, "_id");
            Classd.update({name: 'TK B2'}, {$pushAll: {_teacher: t}}, {multi:true}, function (err, ok) {
                console.log(ok)
            });
        })

        User.find({'email': {$in: cpg}}).exec(function (err, tcr) {
            var t = _.pluck(tcr, "_id");
            Classd.update({name: 'PG'}, {$pushAll: {_teacher: t}}, {multi:true}, function (err, ok) {
                console.log(ok)
            });
        })

    }, 4000);

    setTimeout(function (argument) {
            var management = ['ancilla@pandu.sch.id'];
            var teachername = ['desy@pandu.sch.id','endang@pandu.sch.id','maranatha@pandu.sch.id','karolina@pandu.sch.id','rida@pandu.sch.id'];

            Group.create({name:'pandu-management'},{name:'pandu-teacher'}, function (err, group) {
                User.find({email: {$in: management}}).exec(function (err, manager) {
                    var manager_id = _.pluck(manager, '_id');
                    Group.update({name:'pandu-management'}, {$pushAll: {_teacher: manager_id}}, {multi: true}, function (err, ok) {
                        console.log('group management updated');
                    });
                })

                User.find({email: {$in: teachername}}).exec(function (err, teacher) {
                    var teacher_id = _.pluck(teacher, '_id');
                    Group.update({name:'pandu-teacher'}, {$pushAll: {_teacher: teacher_id}}, {multi: true}, function (err, ok) {
                        console.log('group teacher updated');
                    });
                })

            });

    }, 4000);
});