const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
mongoose.connect('mongodb://localhost/userManagement', {useNewUrlParser: true}); // userManagement is the db name

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('db connected');
});

const userSchema = new mongoose.Schema({
    name: String,
    role: String,
    age: { type: Number, min: 18, max: 70 },
    createDate: {type: Date, default: Date.now}
});

const user = mongoose.model('userCollection', userSchema); // userCollection is the db collection name

app.post('/newUser', (req, res) => { // /newUser is called the ENDPOINT // This is a rest API(app.post)
   console.log(`POST /newUser: ${JSON.stringify(req.body)}`);
   const newUser = new user();
   newUser.name = req.body.name;
   newUser.role = req.body.role;
   newUser.save((err, data) => {
       if (err) {
           return console.log(`new user save: ${data}`);
           res.send(`done ${data}`);
       }
   });
}); // test this with `curl --data "name=Peter&role=student" http://localhost:8080/newUser`

app.get('/user/:name', (req, res) => { // endpoint is "/user'\" & ":name" is the parameter // app.get method edit in user manager app
    let userName = req.params.name; // this is to access value of parameter
    console.log(`GET /user/:name ${JSON.stringify(req.params)}`);
    user.findOne({name: userName }), (err, data) => {
        if (err) return console.log(`opps! ${err}`);
        console.log(`data -- ${JSON.stringify(data)}`);
        let returnMsg = `user name : ${userName} role : ${data.role}`;
        console.log(returnMsg);
        res.send(returnMsg);
    }
});

app.post('/updateUserRole', (req, res) => {  // edit in user manager
    console.log(`POST /updateUserRole: ${JSON.stringify(req.body)}`);
    let matchedName = req.body.name;
    let newrole = req.body.role;
    user.findOneAndUpdate({name: matchedName}, {role: newrole}), {new: true}, (err, data) => {
        if(err) return console.log(`Oops! ${err}`);
        console.log(`data -- ${data.role}`);
        let returnMsg = `user name : ${matchedName} New Role : ${data.role}`;
        console.log(returnMsg);
        res.send(returnMsg);
    };
});

app.post('/removeUser', (req, res) => {
    console.log(`POST /removeUser: ${JSON.stringify(req.body)}`);
    let matchedName = req.body.name; // req.params.clientId
    user.findOneAndDelete({name: matchedName}, (err, data) => {
        if (err) return console.log(`data -- ${JSON.stringify(data)}`);
        let returnMsg = `user name : ${matchedName} removed data : ${data}`;
        console.log(returnMsg);
        res.send(returnMsg);
    });
});

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`App server listen on port: ${port}`);
});