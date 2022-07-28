const Thing = require('../models/thing');
const express = require('express');
const fs = require('fs');

exports.createThing = (req, res, next) => {

  const sauce = JSON.parse(req.body.sauce);
  const { name, manufacturer, description, mainPepper, heat, userId } = sauce;

  const thing = new Thing({
    userId,
    name,
    manufacturer,
    description,
    mainPepper,
    heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],    
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

  });
  thing.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

exports.getOneThing = (req, res, next) => {
  Thing.findOne({
    _id: req.params.id
  }).then(
    (thing) => {
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifyThing = (req, res, next) => {
  let sauce;
  const thingObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete thingObject._userId;
  Thing.findOne({_id: req.params.id})
      .then((thing) => {
          if (thing.userId != req.auth.userId) {
              res.status(403).json({ message : 'unauthorized request'});
          } else {
              Thing.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id})
      .then(thing => {
          if (thing.userId != req.auth.userId) {
            res.status(403).json({ message : 'unauthorized request'});
          } else {
              const filename = thing.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Thing.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

exports.getAllStuff = (req, res, next) => {
  Thing.find().then(
    (things) => {
      res.status(200).json(things);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
exports.statusOfLikesAndDislikes = (req, res, next) => {

  if (req.body.like === 1) {
    Thing.updateOne(
      {_id: req.params.id},
      {
        $push: {usersLiked: req.body.userId,},
        $inc: {likes: +1},
      }
    )
    .then(() =>
    res.status(200).send({message: "Like"})
    )
    .catch((error) =>
      res.status(400).send({error})
    );
  }

  if (req.body.like === -1) {
    Thing.updateOne(
      {_id: req.params.id},
      {
        $push: {usersDisliked: req.body.userId},
        $inc: {dislikes: +1},
      }
    )
    .then(() =>
    res.status(200).send({message: "Dislike"})
  )
  .catch((error) =>
    res.status(400).send({error})
  );
  }

  if (req.body.like === 0) {
    Thing.findOne({
      _id: req.params.id,
    })

      .then((sauce) => {
        if(sauce.usersLiked.includes(req.body.userId)){
          Thing.updateOne(
            {_id: req.params.id},
            {
            $pull: {usersLiked: req.body.userId},
            $inc: {likes: -1},
            }
          )
          .then(() =>
          res.status(200).send({message: "Like enlevé"})
          )
          .catch((error) =>
          res.status(400).send({error})
          );
        }
      
        if(sauce.usersDisliked.includes(req.body.userId)){
          Thing.updateOne(
            {_id: req.params.id},
            {
            $pull: {usersDisliked: req.body.userId},
            $inc: {dislikes: -1},
            }
          )
          .then(() =>
          res.status(200).send({message: "Dislike enlevé"})
          )
          .catch((error) =>
          res.status(400).send({error})
          );
        }
      })
      .catch((error) =>
      res.status(404).send({error})
    );
  }
    
}