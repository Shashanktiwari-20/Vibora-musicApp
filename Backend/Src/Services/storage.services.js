const ImageKit = require("@imagekit/nodejs");

const client = new ImageKit ({
    privateKey  : process.env.IMAGEKIT_PRIVATE_KEY
})

const uploadfile = async (file)=>{
    const result = await client.files.upload({
        file,
        fileName : "music_" + Date.now(),
        folder : "spotify-clone"
    })
    return result;
}

module.exports = {uploadfile}