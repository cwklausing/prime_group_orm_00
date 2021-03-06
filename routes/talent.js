var express = require('express');
var router = express.Router();
var Talent = require('../models/talent');
var Talents = require('../models/collections/talents');

/* GET all talent. */
router.get('/', function(req, res, next) {
  Talents.forge()
    .fetch()
    .then(function(collection){
      res.json({data: collection.toJSON()});
    })
    .catch(function(err) {
      next(err);
    });
});
/* POST talent */
router.post('/', function(req, res, next) {
  console.log(req.body);
  Talent.forge({
    talent_legacy_id: req.body.talentLegacyId,
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    city: req.body.city,
    state: req.body.state
  })
    .save()
    .then(function(talent){
        talent.load(['skills'])
            .then(function(model){
                model.skills().attach(req.body.skills);
                res.json({talentId: talent.get('talent_id'),skill: "They're added too!"});
            })
            .catch(function(err){
                next(err);
            });
    })
    .catch(function(err) {
      next(err);
    });
});

//TODO: PUT route to update a talent
router.put('/', function(req, res, next) {
  //find talent, update talent with data from request, save talent. Conquer.
  Talent.forge({
    first_name: req.body.firstName,
    last_name: req.body.lastName})
      .fetch({require: true})
      .then(function(talent) {
        var temp = {};
        temp[req.body.field] = req.body.content;
        talent.save(temp)
            .then(function(talent){
          console.log("talent update successful!");
                res.send(talent);
        });
      });
});
//TODO: DELETE route to delete a talent
router.delete('/:id', function(req, res, next) {
    console.log(req.params.id);
    Talent.forge({
        talent_id: req.params.id})
        .fetch({require: true})
        .then(function(talent) {
            talent.destroy()
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
