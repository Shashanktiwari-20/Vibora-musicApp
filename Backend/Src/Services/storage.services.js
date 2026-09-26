const ImageKit = require("@imagekit/nodejs");
const config = require("../Config/config")

const client = new ImageKit ({
    privateKey  : config.IMAGEKIT_PRIVATE_KEY
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