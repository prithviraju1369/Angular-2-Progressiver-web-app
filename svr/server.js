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




app.listen(3000, '127.0.0.1',function(){
    console.log('listening at 3000');
})