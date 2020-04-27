var mongoose = require('mongoose'),
    User = mongoose.model('users');
const jwt = require('jsonwebtoken');
const auth = require('../config/auth');

exports.login = (req, response) => {
    let json = JSON.stringify(req.body);
    let data = JSON.parse(json);

    const note = { 
        userName: data.userName, 
        password: data.password
    };
    
    User.findOne(note, (err, user) => {
        if (!user) {
            response.status(404).send({
                message: 'User not found.'
            });
            return;
        }
        if (err) {
            response.send(err);
            return;
        }
        user.token = generationToken(user);

        response.status(200).send(user);
    })
};

exports.registrate = function(req, res){
    let json = JSON.stringify(req.body);
    let data = JSON.parse(json);
    console.log(data);
    const note = { 
        userName: data.userName, 
        password: data.password
    };

    var new_task = new User(note);
        new_task.save(function(err, user) {
            if (err) {
                if (err.code === 11000) {
                    console.log("error exists");
                    res.status(409).send({message: 'Account already exists.'});
                    return;
                }
                console.log(err);
                res.status(400).send(err);
                return
            }
         else {
            user.token = generationToken(user);
            res.status(200).send(user);
        }
    });
}

let generationToken = (user) => {
    return jwt.sign({
        userName: user.userName
    }, auth.secretKey, {expiresIn: auth.expires});
};
