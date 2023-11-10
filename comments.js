//Create a web server
const express = require('express');
const router = express.Router({ mergeParams: true });
const { Comment, validateComment } = require('../models/comment');
const { Post } = require('../models/post');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

//Get all comments
router.get('/', async (req, res) => {
  const comments = await Comment.find();
  res.send(comments);
});

//Get comments for a post
router.get('/:postId', validateObjectId, async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).send('Post not found');

  const comments = await Comment.find({ post: post._id }).select('-__v');

  res.send(comments);
});

//Create a new comment
router.post('/', auth, async (req, res) => {
  const { error } = validateComment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const post = await Post.findById(req.body.postId);
  if (!post) return res.status(404).send('Post not found');

});
