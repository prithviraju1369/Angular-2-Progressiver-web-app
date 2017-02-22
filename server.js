var express = require('express');
var path=require('path');
var app = express();
var router=express.Router();
var bodyParser = require('body-parser')
var nodemailer = require('nodemailer');
var firebaseAdmin=require('firebase-admin');
var serviceAccount = require("./firebase-secret.js");



app.use(express.static(path.join(__dirname, './dist')));

app.use(bodyParser.urlencoded({ extended: false }))
 
app.use(bodyParser.json())

//email code

var transporter = nodemailer.createTransport('smtps://prithviraju1369%40gmail.com:Test@smtp.gmail.com');
var siteUrl;
var sendUrl;





// firebase server initialization
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://shoppinglist-12407.firebaseio.com"
});


var listRef = firebaseAdmin.database().ref();

// sListUsers collection child_changed event send email 
listRef.child('sListUsers').on('child_changed', function(dataSnapshot) { 
    const msg= dataSnapshot.val();
    const key= dataSnapshot.key;
    for (var property in msg) {
        if (msg.hasOwnProperty(property)) {
            if(msg[property]) {
                msg[property]=false;
                queryEmail(key,property);
                // listRef.child('sListUsers').child(key).update(msg);
            }
        }
    }
    for (var property in msg) {
        if (msg.hasOwnProperty(property)) {
            msg[property]=false;
            // queryEmail(property);
            listRef.child('sListUsers').child(key).update(msg);
        }
    }
    
});

// email id from user id
var queryEmail=function(key,property){
    listRef.child('users').orderByKey().equalTo(property).limitToLast(1).on("value",function(data){
        var obj =data.val();
        if(obj){
        sendEmail(key,property, obj[property].email)
        }
    });
}



//send email
var sendEmail=function(key,property,mailId){
    // siteUrl=req.protocol + '://' + req.get('host');
    siteUrl="https://angular2-progressive-app.herokuapp.com";
    sendUrl= siteUrl+"/#/list/"+key+";email="+property;
    var mailOptions = {
        from: 'prithviraju1369@gmail.com', // sender address
        to: mailId, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world ?', // plaintext body
        html: '<p>test</p><a href='+sendUrl+'>Click here to Go</a>' // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });

}


/// app runs in port
app.listen(process.env.PORT || 3000,function(){
    console.log('listening at 3000');
})
