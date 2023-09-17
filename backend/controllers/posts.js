const Post = require('../models/post')
exports.createpost = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + '/images/' + req.file.filename,
      creator: req.userData.userId
    })
    post.save().then((created) => {
      console.log(post)
      res.status(201).json({
        message: 'Post added successfully',
        post: {
          id: created._id,
          title: created.title,
          content: created.content,
          imagePath: created.imagePath,
          creator: created.creator
        }
      })
    }).catch(()=>{
      res.status(500).json({
        message:'fetching a post failed!!'
      })
    })
  
  }

  exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    console.log(req.file)
    if (req.file) {
      const url = req.protocol + '://' + req.get('host')
      imagePath = url + '/images/' + req.file.filename
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator:req.userData.userId
    })
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
      if (result.n > 0) {
        console.log(result)
        res.status(200).json({ message: 'This updation is successful' })
      }
      else {
        res.status(401).json({ message: 'Not Authorized' })
      }
    })
    .catch(()=>{
      res.status(500).json({
        message:'updating a post failed!!'
      })
    })
  
  }

  exports.getPosts = (req, res, next) => {
    const postQuery = Post.find()
    const pageSize = +req.query.pageSize
    const currPage = +req.query.currpage
    let fetchPosts;
    if (pageSize && currPage) {
      postQuery.skip(pageSize * (currPage - 1)).limit(pageSize)
    }
    postQuery.then((documents) => {
      fetchPosts = documents
      return Post.count()
  
    }).then(count => {
      res.status(200).json({
        message: 'This is from server post succesful',
        post: fetchPosts,
        maxCount: count
  
      })
    })
    .catch(()=>{
      res.status(500).json({
        message:'fetching a post failed!!'
      })
    })
  }

  exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then((post) => {
      if (post) { res.status(200).json(post) }
      else { res.status(404).json({ message: 'Page not found' }) }
  
    }).catch(()=>{
      res.status(500).json({
        message:'getting a post failed!!'
      })
    })
  
  }

  exports.deletePost = (req, res, next) => {
    console.log('Hey raech')
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then((documents) => {
      if (documents.n > 0) {
        console.log(documents)
        res.status(200).json({ message: 'This deletion is successful' })
      }
      else {
        res.status(401).json({ message: 'Not Authorized' })
      }
  
  
    }).catch(()=>{
      res.status(500).json({
        message:'fetching a post failed!!'
      })
    })
  }