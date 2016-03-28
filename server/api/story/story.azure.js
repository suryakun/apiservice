var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var request = require("request");
var User = require('../user/user.model');
var Story = require('./story.model');
var moment = require('moment');

var _ = require('lodash');
var https = require('https');

exports.createCalendar = function (story_id, receivers, start, end, description) {
    if (receivers.length > 0) {
        
        var options = {
          "start": {
            "dateTime": start,
            "timeZone": "Asia/Bangkok"
          },
          "end": {
            "dateTime": end,
            "timeZone": "Asia/Bangkok"
          },
          "body" : {"contentType": "text",
                      "content": description},
          "subject" : "7pagi update event",
          "bodyPreview": description,
          "reminderMinutesBeforeStart": 99,
          "isReminderOn": true,
        }

        _.each(receivers, function (azureReceiver) {
            
            if (azureReceiver.azure) {
                azureReceiver.refreshAzure(function (err, azure) {
                    if (azure && azure.access_token) {
                        request.post({
                            url: 'https://graph.microsoft.com/v1.0/me/calendar/events',
                            headers: {
                              'content-type': 'application/json',
                              'authorization': 'Bearer ' + azure.access_token,
                            },
                            body: JSON.stringify(options)
                        }, function (err, response, body) {
                            if (err) {
                              console.error('>>> Application error: ' + err);
                            } else {
                              var parsedBody = JSON.parse(body);
                              var displayName = "surya";

                              if (parsedBody.error) {
                                if (parsedBody.error.code === 'RequestBroker-ParseUri') {
                                  console.error('>>> Error creating an event for ' + displayName  + '. Most likely due to this user having a MSA instead of an Office 365 account.');
                                } else {
                                  console.error('>>> Error creating an event for ' + displayName  + '.' + parsedBody.error.message);
                                }
                              } else {
                                console.log('>>> Successfully created an event on ' + displayName + "'s calendar.");
                              }
                            }
                        });
                    }
                })
            };
        })

        Story.update({_id:story_id}, {$set:{calendar: options}}, {multi: false}, function (err, ok) {
            if (err) console.log(err);
            console.log(ok);
        })

    };    
}

exports.getEvents = function (access_token, start, end, callback) {
    request.get({
        url: 'https://graph.microsoft.com/v1.0/me/calendar/calendarView?startDateTime='+start+'&endDateTime=' + end,
        headers: {
            'authorization': 'Bearer ' + access_token,
        }
    }, function (err, response, body) {
        if (err) {callback(err, null)};
        callback(null, body);
    })
}

exports.sendMail = function (to, text) {

  var transporter = nodemailer.createTransport(smtpTransport({
    service: "Office365",
      host: "smtp.office365.com",
      port:587,
      auth: {
          user: "halo@7pagi.com",
          pass: "7Pagi123"
      }
  }));

  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: "7Pagi <halo@7pagi.com>", // sender address
      to: to, // list of receivers
      subject: "7Pagi Notification", // Subject line
      html: '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>7pagi - Info</title><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head><body style="margin: 0; padding: 0;"><table bgcolor="#f6f8fa" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-family: \'Roboto\',\'Helvetica Neue\', Helvetica, Arial, sans-serif; max-width: 600px;margin: 10px auto"><tr><td bgcolor="#f6f8fa" style="text-align: center; padding: 20px 0;"><img src="http://web.7pagi.com:8080/assets/img/logo-biru.png" alt="logo" width="200px" height="70px" /></td></tr><tr><td style="padding: 0 10px; color: #505458;"><table bgcolor="#ffffff" cellpadding="0" cellspacing="0" style="border-radius: 5px;"><tr><td style="padding: 20px"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td rowspan="2" style="width: 60px; text-align: center"><img width="35" height="35" style="border-radius: 50%;" src="'+ text.avatar + '" alt="profile"> </td><td><span style="font-size: 18px; font-weight: bold; display: block"> '+ text.author +' </span></td></tr><tr><td style="font-size: 13px;line-height: 11px;color: #B3C1C2;">Teacher</td></tr></table></td></tr><tr><td colspan="2" style="padding: 10px 20px 20px; line-height: 22px; font-size: 16px;">'+ text.description +'</td></tr><tr><td colspan="2" style="padding: 10px 20px 20px;"><table cellpadding="1" cellspacing="0" border="0"><tr><td><a href="http://web.7pagi.com:8080"><img src="'+ text.pic +'" alt="img" style="width: 100%"/></a></td></tr><tr><td style="text-align: center;padding-top: 20px"><a href="http://web.7pagi.com:8080" style="background: #3CC2CE; text-decoration: none; color: white; padding: 5px 10px; font-size: 14px; border-radius: 5px">See more</a></td></tr></table></td></tr></table></td></tr><tr><td bgcolor="#f6f8fa" style="padding:70px 20px 20px; text-align: center;color: #888888; font-size: 11px;">Copyright &copy; 2016 7Pagi Digital Edumedia</td></tr></table></body></html>' // html body
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, response){
      if(error){
          console.log(error);
      }else{
          console.log("Message sent: " + response.message);
      }
      // if you don't want to use this transport object anymore, uncomment following line
      //smtpTransport.close(); // shut down the connection pool, no more messages
  });

}