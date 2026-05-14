const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    caption:{
        type:String,
        default:""
    },
    mediaURL:{
        type:String,
        required:[true,"mediaURL required to upload an post"]
    },
    mediaType:{
        type:String,
        enum:["image","video"],
        default:"image"
    },
    user:{
        ref : "newUsers",
        type:mongoose.Schema.Types.ObjectId,
        required:[true,"user required to upload an post"]
    }
})

const postModel = mongoose.model("newPosts",postSchema)

module.exports = postModel