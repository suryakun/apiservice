var outlook = require('node-outlook');

exports.createCalendar = function (email, event) {
    // Set the API endpoint to use the v2.0 endpoint
    outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');

    // This is the oAuth token 
    var token = "token";

    var newEvent = event;

    // Pass the user's email address
    var userInfo = {
        email: email
    };

    outlook.calendar.createEvent({token: token, event: newEvent, user: userInfo},
        function(error, result){
            if (error) {
                console.log('createEvent returned an error: ' + error);
            }
            else if (result) {
                console.log(JSON.stringify(result, null, 2));
            }
    });
}

exports.getEvents = function (email) {
        // Set the API endpoint to use the v2.0 endpoint
    outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');

    // This is the oAuth token 
    var token = "";

    // Set up oData parameters
    var queryParams = {
      '$select': 'Subject,Start,End',
      '$orderby': 'Start/DateTime desc',
      '$top': 20
    };

    // Pass the user's email address
    var userInfo = {
      email: email
    };

    outlook.calendar.getEvents({token: token, folderId: 'Inbox', odataParams: queryParams, user: userInfo},
      function(error, result){
        if (error) {
          console.log('getEvents returned an error: ' + error);
        }
        else if (result) {
          console.log('getEvents returned ' + result.value.length + ' events.');
          result.value.forEach(function(event) {
            console.log('  Subject:', event.Subject);
            console.log('  Start:', event.Start.DateTime.toString());
            console.log('  End:', event.End.DateTime.toString());
          });
        }
      });
}

exports.sendMail = function (to, text) {
    var server  = email.server.connect({
       user:    "azhararraniry@hotmail.com", 
       password:"Pa55word!*", 
       host:    "smtp-mail.outlook.com", 
       tls: {ciphers: "SSLv3"}
    });

    var message = {
       from:    "Azhar <azhararraniry@hotmail.com>", 
       to:      to,
       subject: "7pagi notification",
       attachment: 
       [
          {data:'<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>7pagi - Info</title><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head><body style="margin: 0; padding: 0;"><table bgcolor="#f6f8fa" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-family: \'Roboto\',\'Helvetica Neue\', Helvetica, Arial, sans-serif; max-width: 600px;margin: 10px auto"><tr><td bgcolor="#f6f8fa" style="text-align: center; padding: 20px 0;"><img src="web.7pagi.com:8080/assets/img/logo-small.png" alt="logo" /></td></tr><tr><td style="padding: 0 10px; color: #505458;"><table bgcolor="#ffffff" cellpadding="0" cellspacing="0" style="border-radius: 5px;"><tr><td style="padding: 20px"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td rowspan="2" style="width: 60px; text-align: center"><img width="35" height="35" style="border-radius: 50%;" src="'+ text.avatar + '" alt="profile"> </td><td><span style="font-size: 18px; font-weight: bold; display: block"> '+ text.author +' </span></td></tr><tr><td style="font-size: 13px;line-height: 11px;color: #B3C1C2;">Teacher</td></tr></table></td></tr><tr><td colspan="2" style="padding: 10px 20px 20px; line-height: 22px; font-size: 16px;">'+ text.description +'</td></tr></table></td></tr><tr><td bgcolor="#f6f8fa" style="padding:70px 20px 20px; text-align: center;color: #888888; font-size: 11px;">Copyright &copy; 2016 7Pagi Digital Edumedia</td></tr></table></body></html>', alternative:true}
       ]
    };

    // send the message and get a callback with an error or details of the message that was sent
    server.send(message, function(err, message) { console.log(err || message); });
}