const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
    projectId: 'omega-strand-384917',
    keyFilename: './omega-strand-384917-fd18d923ad4c.json'
});
const Post = require('../models/postModel');
const Tag = require('../models/tagModel')
const db = require('../dbConfig')
const dbStatus = db.states.connected
const bucketName = 'ideausher';
const bucket = storage.bucket(bucketName);
const fs = require('fs');


//  Retrieve a list of all posts with optional filtering, sorting, and pagination.
//  @route GET /post
//  @ref {URI} - localhost:5000/post?filter=mag&sort=asc&page=1
exports.getAllPosts = async (req, res) => {

    //  @param {string} [filter=mag] - Search term to filter posts by (searches title and description).
    //  @param {string} [sort=asc] - Sort order for posts.
    //  @param {number} [page=1] - Number of posts to skip before starting to return items.
    const { filter, sort, page } = req.query;

    try {
        let filters = {};
        let sortOptions = {};

        if (dbStatus === 1) {

            if (filter) {
                filters.$or = [
                    { title: { $regex: filter, $options: 'i' } },
                    { desc: { $regex: filter, $options: 'i' } }
                ];
            }

            if (sort) {
                sortOptions = sort === 'asc' ? "1" : "-1"
            }

            const posts = await Post.find(filters)
                .sort({ _id: sortOptions })
                .skip(page)
                .populate('tags')
                .exec();

            //  @returns {Array.<Object>} 200 - A list of posts.
            res.status(200).json(posts);

        } else {
            //  @returns {Error} 500 - Internal server error.
            res.status(500).json({ message: "Database error" });
        }


    } catch (error) {
        //  @returns {Error} 500 - Internal server error.
        res.status(500).json({ message: error.message });
    }
};


//  Retrieve a list of all posts based on search keywords in the title and description.
//  @route GET /post/search?query
//  @ref {URI} - localhost:5000/post/search?query=qui est esse
exports.searchPosts = async (req, res) => {

    //  @param {string} [query] - Search term to filter posts by (searches title and description).
    const { query } = req.query;

    try {

        if (dbStatus === 1) {

            const posts = await Post.find({
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { desc: { $regex: query, $options: 'i' } }
                ]
            })
                .populate('tags')
                .exec();

            //  @returns {Array.<Object>} 200 - A list of posts.
            res.status(200).json(posts);
        } else {
            //  @returns {Error} 500 - Internal server error.
            res.status(500).json({ message: "Database error" });
        }


    } catch (error) {
        //  @returns {Error} 500 - Internal server error.
        res.status(500).json({ message: error.message });
    }

}


//  Retrieve a list of all posts equivalent to tag.
//  @route GET /post/tags/:tagId
//  @ref {URI} - localhost:5000/post/tags/64490a3517d0f1a7c2d221c3
exports.searchPostsByTags = async (req, res) => {

    //  @param {string} [tagId] - to get all post associated with tagID.
    const { tagId } = req.params;

    try {
        if (dbStatus === 1) {
            const posts = await Post.find({ tags: tagId })
                .populate('tags')
                .exec();

            //  @returns {Array.<Object>} 200 - A list of posts.
            res.status(200).json(posts);

        } else {
            //  @returns {Error} 500 - Internal server error.
            res.status(500).json({ message: "Database error" });
        }

    } catch (error) {
        //  @returns {Error} 500 - Internal server error.
        res.status(500).json({ message: error.message });
    }

}


//  Upload post image to cloud(Google_cloud_bucket used).
//  @route {POST} /post/upload/:postId
//  @ref {URI} - localhost:5000/post/upload/6449036e17d0f1a7c2d221b9
exports.uploadPostImage = async (req, res) => {
    try {

        const file = req.file;
        //  @param {string} [postId] - to get post associated with postId.
        const { postId } = req.params;

        // @error {ERROR} - throw error if file does not uploaded
        if (!file) {
            const error = new Error('No file uploaded');
            error.statusCode = 400;
            res.status(400).json({ message: error })
        }

        if (file) {

            // @bucket {BUCKET} - upload to bucket
            bucket.upload(`./tempdir/${file.originalname}`, async function (err, success) {
                if (err) throw new Error(err);
                else {

                    //@TEMP to remove temp files
                    fs.unlinkSync(`./tempdir/${file.originalname}`)

                    //@MONGO {FINDandUPDATE} - find and update the image url
                    const postImageUpdate = await Post.findOneAndUpdate({ _id: postId }, {
                        $set: { image: `https://storage.googleapis.com/${bucketName}/${file.originalname}` }
                    }, { returnDocument: 'after' })

                    if (postImageUpdate) {
                        //  @returns {Array.<Object>},{Objects} 200 - Message, a previewUrl and updated post.
                        res.status(200).json(
                            {
                                message: 'File uploaded successfully',
                                PreviewUrl: `https://storage.googleapis.com/${bucketName}/${file.originalname}`,
                                post: postImageUpdate
                            }
                        );
                    }
                }
            })
        }

    } catch (err) {
        //  @returns {Error} 500 - Internal server error.
        res.status(500).json({ message: err.message })
    }
}