var express = require('express');
var path=require('path');
var app = express();
var router=express.Router();

app.use(express.static(path.join(__dirname, './../dist')));



app.get('/users', function(req,res){
    var users=[
        {name:"prithvi"},
        {name:"prithvi"},
    ]
    res.send(users);
});




app.listen((process.env.PORT || 3000,function(){
    console.log('listening at 3000');
})