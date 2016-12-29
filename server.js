var express = require('express');
var path=require('path');
var app = express();
var router=express.Router();
var bodyParser = require('body-parser')
var nodemailer = require('nodemailer');

app.use(express.static(path.join(__dirname, './dist')));

app.use(bodyParser.urlencoded({ extended: false }))
 
app.use(bodyParser.json())

app.get('/users', function(req,res){
    var users=[
        {name:"prithvi"},
        {name:"prithvi"},
    ]
    res.send(users);
});

var transporter = nodemailer.createTransport('smtps://prithviraju1369%40gmail.com:Test@smtp.gmail.com');
var siteUrl;
var sendUrl;
app.post('/api/email',function(req,res){
    siteUrl=req.protocol + '://' + req.get('host');
    sendUrl= siteUrl+"/#/list/"+req.body.$key+";email="+req.body.email;
    var mailOptions = {
        from: 'prithviraju1369@gmail.com', // sender address
        to: req.body.email, // list of receivers
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
})



app.listen(process.env.PORT || 3000,function(){
    console.log('listening at 3000');
})