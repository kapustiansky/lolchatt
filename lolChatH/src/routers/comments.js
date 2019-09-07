const express = require('express');
const mongoose = require('mongoose');
const BodyParser = require("body-parser");
const ObjectID = require("mongodb").ObjectID;

const router = express.Router()

router.use(BodyParser.json())
router.use(BodyParser.urlencoded({ extended: true }))

const commentSchema = mongoose.Schema({
    date: {type: String},
    body: {type: String},
    username: {type: String},
    user_Id: {type: String}
}, {
    versionKey: false
});

router.post('/comments', async (req, res) => {
    try {
        const comment = new Comment(req.body)
        await comment.save()
        //res.send()
        res.sendStatus(200)

            } catch (error) {
                res.status(500).send(error)
            }
});

router.get('/comments', (req, res) => {

    const comments = mongoose.model('comments', commentSchema);
    
    comments.find({}, function(err, data) { 
        
        if (err) { 
            console.log(err)
            return res.sendStatus(500)
        }
        res.send(data); });
    
});

router.delete('/comments/:id', (req, res) => {
    
    const comments = mongoose.model('comments', commentSchema);

    comments.deleteOne({ _id: ObjectID(req.params.id) }, function (err) { 
        
        if (err) {
            res.sendStatus(500)
        }});
    res.sendStatus(200)
})

const Comment = mongoose.model('Comment', commentSchema);

module.exports = router