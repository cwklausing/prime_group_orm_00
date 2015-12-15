/**
 * Created by cwklausing on 12/15/15.
 */
var express = require('express');
var router = express.Router();
var Skill = require('../models/skill');
var Skills = require('../models/collections/skills');

/* GET all skill. */
router.get('/', function(req, res, next) {
    Skills.forge()
        .fetch()
        .then(function(collection){
            res.json({data: collection.toJSON()});
        })
        .catch(function(err) {
            next(err);
        });
});
/* POST skill */
router.post('/', function(req, res, next) {
    console.log(req.body);
    Skill.forge({
            skill_name: req.body.skillName})
        .save()
        .then(function(skill){
            res.json({skillId: skill.get('skill_id')});
        })
        .catch(function(err) {
            next(err);
        });
});

//TODO: PUT route to update a skill
router.put('/', function(req, res, next) {
    //find skill, update skill with data from request, save skill. Conquer.
    Skill.forge({
            skill_id: req.body.skillId})
        .fetch({require: true})
        .then(function(skill) {
            skill.save({skill_name:req.body.newName})
                .then(function(skill){
                    console.log("skill update successful!");
                    res.send(skill);
                });
        });
});
//TODO: DELETE route to delete a skill
router.delete('/:id', function(req, res, next) {
    console.log(req.params.id);
    Skill.forge({
            skill_id: req.params.id})
        .fetch({require: true})
        .then(function(skill) {
            skill.destroy()
                .then(function() {
                    res.send("File deleted");
                })
                .catch(function(err) {
                    next(err);
                });
        })
        .catch(function(err) {
            next(err);
        });
});
module.exports = router;
