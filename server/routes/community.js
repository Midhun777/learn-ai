const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const GamificationService = require('../services/gamificationService');

// @route   GET api/community
// @desc    Get all community insights
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'name username level')
            .populate('comments.user', 'name username')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/community
// @desc    Create a community insight
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ msg: 'Content is required' });

        const newPost = new Post({
            user: req.user.id,
            content
        });

        const post = await newPost.save();
        
        // Populate user info for immediate display
        await post.populate('user', 'name username level');

        // Award points for sharing
        try {
            await GamificationService.awardXP(req.user.id, 10, 'Insight Shared');
        } catch (cardErr) {
            console.error('Gamification failed but post saved', cardErr.message);
        }

        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/community/:id/like
// @desc    Toggle high-five (like) on an insight
// @access  Private
router.put('/:id/like', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Insight not found' });

        const likeIndex = post.likes.indexOf(req.user.id);
        if (likeIndex === -1) {
            post.likes.push(req.user.id);
        } else {
            post.likes.splice(likeIndex, 1);
        }

        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/community/:id/comment
// @desc    Reply to an insight
// @access  Private
router.post('/:id/comment', auth, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ msg: 'Reply text is required' });

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Insight not found' });

        const newComment = {
            user: req.user.id,
            text
        };

        post.comments.push(newComment);
        await post.save();

        const updatedPost = await Post.findById(req.params.id)
            .populate('comments.user', 'name username');
        
        res.json(updatedPost.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/community/:id
// @desc    Update a community insight
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const { content } = req.body;
        let post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ msg: 'Insight not found' });

        // Check ownership
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        post.content = content;
        await post.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/community/:id
// @desc    Delete a community insight
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ msg: 'Insight not found' });

        // Check ownership
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await post.deleteOne();
        res.json({ msg: 'Insight removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
