const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const multer = require('multer');
const fs = require('fs');

// Create a temporary directory if it does not exist
const tmpDir = "tempdir"
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}

//Setting up multer
const storage = multer.diskStorage({
    destination (req, file, cb) {
        cb(null, 'tempdir/');
    },
    filename (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 500 * 1024, // 500KB
        files: 1 // maximum 1 file
    }
});

router.get('/', postController.getAllPosts);
router.get('/search', postController.searchPosts);
router.get('/tags/:tagId', postController.searchPostsByTags);
router.post('/upload/:postId', upload.single('file'), postController.uploadPostImage)

module.exports = router
