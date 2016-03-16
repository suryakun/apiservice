var outlook = require('node-outlook');
var email   = require("emailjs");

exports.createCalendar = function (email, event) {
    // Set the API endpoint to use the v2.0 endpoint
    outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');

    // This is the oAuth token 
    var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSIsImtpZCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20vIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvM2UwN2VlMTMtMjhmNS00ZmVlLWI3YzctN2NlNjc1NDgzYjc5LyIsImlhdCI6MTQ1ODAzMDUxMSwibmJmIjoxNDU4MDMwNTExLCJleHAiOjE0NTgwMzQ0MTEsImFjciI6IjEiLCJhbXIiOlsicHdkIl0sImFwcGlkIjoiZDA4MTA5MGUtN2U5Zi00ZTk1LTg5ODMtMTg3ZTZlMmZlMjY0IiwiYXBwaWRhY3IiOiIxIiwiZmFtaWx5X25hbWUiOiJBcnJhbmlyeSIsImdpdmVuX25hbWUiOiJBemhhciIsImlwYWRkciI6IjExNS4xNzguMTk5LjIwNCIsIm5hbWUiOiJBemhhciBBcnJhbmlyeSIsIm9pZCI6IjI1ZDEzNjJiLTM4ZTgtNGY4YS04OGMwLTBiMmY1NWZkN2E3ZSIsInB1aWQiOiIxMDAzN0ZGRTkzM0RCNzc5Iiwic2NwIjoiQ2FsZW5kYXJzLlJlYWQgQ2FsZW5kYXJzLlJlYWRXcml0ZSBDb250YWN0cy5SZWFkIENvbnRhY3RzLlJlYWRXcml0ZSBEaXJlY3RvcnkuQWNjZXNzQXNVc2VyLkFsbCBEaXJlY3RvcnkuUmVhZCBEaXJlY3RvcnkuUmVhZC5BbGwgRGlyZWN0b3J5LlJlYWRXcml0ZS5BbGwgZW1haWwgRmlsZXMuUmVhZCBGaWxlcy5SZWFkLlNlbGVjdGVkIEZpbGVzLlJlYWRXcml0ZSBGaWxlcy5SZWFkV3JpdGUuQXBwRm9sZGVyIEZpbGVzLlJlYWRXcml0ZS5TZWxlY3RlZCBHcm91cC5SZWFkLkFsbCBHcm91cC5SZWFkV3JpdGUuQWxsIE1haWwuUmVhZCBNYWlsLlJlYWRXcml0ZSBNYWlsLlNlbmQgTm90ZXMuQ3JlYXRlIE5vdGVzLlJlYWQgTm90ZXMuUmVhZC5BbGwgTm90ZXMuUmVhZFdyaXRlIE5vdGVzLlJlYWRXcml0ZS5BbGwgTm90ZXMuUmVhZFdyaXRlLkNyZWF0ZWRCeUFwcCBvZmZsaW5lX2FjY2VzcyBvcGVuaWQgUGVvcGxlLlJlYWQgcHJvZmlsZSBTaXRlcy5SZWFkLkFsbCBUYXNrcy5SZWFkV3JpdGUgVXNlci5SZWFkIFVzZXIuUmVhZC5BbGwgVXNlci5SZWFkQmFzaWMuQWxsIFVzZXIuUmVhZFdyaXRlIFVzZXIuUmVhZFdyaXRlLkFsbCB1c2VyX2ltcGVyc29uYXRpb24iLCJzdWIiOiI0VjF0Q1hYMHI0Yjd6T2RGRDFINXdDclRzT0hEa2xQX21zaDhEOG1IQ2U4IiwidGlkIjoiM2UwN2VlMTMtMjhmNS00ZmVlLWI3YzctN2NlNjc1NDgzYjc5IiwidW5pcXVlX25hbWUiOiJhemhhcmFyckBDZW5kZWtpYUxlYWRlcnNoaXBTY2hvb2wub25taWNyb3NvZnQuY29tIiwidXBuIjoiYXpoYXJhcnJAQ2VuZGVraWFMZWFkZXJzaGlwU2Nob29sLm9ubWljcm9zb2Z0LmNvbSIsInZlciI6IjEuMCJ9.FV4Yv57cfRi1nF9NRjipclQeRx6SvP1c49J_r91VyjAVSKqTtlsDlrU0__0QJEymfhaet1g1XareeLkdR394OtOFBuq9B5ZJhCPjdG-gDTGzVKf_6LzYKPHcc5AEXbatBby0j0rpEyZvigRJdppoabWGzddpjZT6eimCConNSXtij93D5ZNNjx1yGcepBEILVP_lZfc6xKTYe6kl68kmYvFWht1CsjLeMv7QOrwTNBiK6__w7HdxLYCErK-oYDM2zBP4Zj8NJ7Yb6y8MANv0nV-8xkUu5rpUoNEHNB4DhtrFP8belaOCBG2EvnYYBZBwniHp1qvMvMFd9n19QiWwBQ";

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
    var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSIsImtpZCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20vIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvM2UwN2VlMTMtMjhmNS00ZmVlLWI3YzctN2NlNjc1NDgzYjc5LyIsImlhdCI6MTQ1ODAzMDUxMSwibmJmIjoxNDU4MDMwNTExLCJleHAiOjE0NTgwMzQ0MTEsImFjciI6IjEiLCJhbXIiOlsicHdkIl0sImFwcGlkIjoiZDA4MTA5MGUtN2U5Zi00ZTk1LTg5ODMtMTg3ZTZlMmZlMjY0IiwiYXBwaWRhY3IiOiIxIiwiZmFtaWx5X25hbWUiOiJBcnJhbmlyeSIsImdpdmVuX25hbWUiOiJBemhhciIsImlwYWRkciI6IjExNS4xNzguMTk5LjIwNCIsIm5hbWUiOiJBemhhciBBcnJhbmlyeSIsIm9pZCI6IjI1ZDEzNjJiLTM4ZTgtNGY4YS04OGMwLTBiMmY1NWZkN2E3ZSIsInB1aWQiOiIxMDAzN0ZGRTkzM0RCNzc5Iiwic2NwIjoiQ2FsZW5kYXJzLlJlYWQgQ2FsZW5kYXJzLlJlYWRXcml0ZSBDb250YWN0cy5SZWFkIENvbnRhY3RzLlJlYWRXcml0ZSBEaXJlY3RvcnkuQWNjZXNzQXNVc2VyLkFsbCBEaXJlY3RvcnkuUmVhZCBEaXJlY3RvcnkuUmVhZC5BbGwgRGlyZWN0b3J5LlJlYWRXcml0ZS5BbGwgZW1haWwgRmlsZXMuUmVhZCBGaWxlcy5SZWFkLlNlbGVjdGVkIEZpbGVzLlJlYWRXcml0ZSBGaWxlcy5SZWFkV3JpdGUuQXBwRm9sZGVyIEZpbGVzLlJlYWRXcml0ZS5TZWxlY3RlZCBHcm91cC5SZWFkLkFsbCBHcm91cC5SZWFkV3JpdGUuQWxsIE1haWwuUmVhZCBNYWlsLlJlYWRXcml0ZSBNYWlsLlNlbmQgTm90ZXMuQ3JlYXRlIE5vdGVzLlJlYWQgTm90ZXMuUmVhZC5BbGwgTm90ZXMuUmVhZFdyaXRlIE5vdGVzLlJlYWRXcml0ZS5BbGwgTm90ZXMuUmVhZFdyaXRlLkNyZWF0ZWRCeUFwcCBvZmZsaW5lX2FjY2VzcyBvcGVuaWQgUGVvcGxlLlJlYWQgcHJvZmlsZSBTaXRlcy5SZWFkLkFsbCBUYXNrcy5SZWFkV3JpdGUgVXNlci5SZWFkIFVzZXIuUmVhZC5BbGwgVXNlci5SZWFkQmFzaWMuQWxsIFVzZXIuUmVhZFdyaXRlIFVzZXIuUmVhZFdyaXRlLkFsbCB1c2VyX2ltcGVyc29uYXRpb24iLCJzdWIiOiI0VjF0Q1hYMHI0Yjd6T2RGRDFINXdDclRzT0hEa2xQX21zaDhEOG1IQ2U4IiwidGlkIjoiM2UwN2VlMTMtMjhmNS00ZmVlLWI3YzctN2NlNjc1NDgzYjc5IiwidW5pcXVlX25hbWUiOiJhemhhcmFyckBDZW5kZWtpYUxlYWRlcnNoaXBTY2hvb2wub25taWNyb3NvZnQuY29tIiwidXBuIjoiYXpoYXJhcnJAQ2VuZGVraWFMZWFkZXJzaGlwU2Nob29sLm9ubWljcm9zb2Z0LmNvbSIsInZlciI6IjEuMCJ9.FV4Yv57cfRi1nF9NRjipclQeRx6SvP1c49J_r91VyjAVSKqTtlsDlrU0__0QJEymfhaet1g1XareeLkdR394OtOFBuq9B5ZJhCPjdG-gDTGzVKf_6LzYKPHcc5AEXbatBby0j0rpEyZvigRJdppoabWGzddpjZT6eimCConNSXtij93D5ZNNjx1yGcepBEILVP_lZfc6xKTYe6kl68kmYvFWht1CsjLeMv7QOrwTNBiK6__w7HdxLYCErK-oYDM2zBP4Zj8NJ7Yb6y8MANv0nV-8xkUu5rpUoNEHNB4DhtrFP8belaOCBG2EvnYYBZBwniHp1qvMvMFd9n19QiWwBQ";

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