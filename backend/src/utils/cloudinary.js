import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

// Configuration
cloudinary.config({ 
    cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`, 
    api_key: `${process.env.CLOUDINARY_API_KEY}`, 
    api_secret: `${process.env.CLOUDINARY_API_SECRET}`, // Click 'View API Keys' above to copy your API secret
    secure: true
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        //upload file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        //File successfully uploaded
        console.log("File uploaded Successfully! ",response.url);
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        console.error("Error Occured while uploading file ",error);
        
        fs.unlinkSync(localFilePath) //remove the locally saved file in case of failure
        return null;
    }
}

export {uploadOnCloudinary}