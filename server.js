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

var transporter = nodemailer.createTransport('smtps://prithviraju1369%40gmail.com:pass@smtp.gmail.com');


app.post('/api/email',function(req,res){
    var mailOptions = {
        from: 'prithviraju1369@gmail.com', // sender address
        to: 'prithviraju1369@gmail.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world ?', // plaintext body
        html: '<b>Hello world ?</b>' // html body
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