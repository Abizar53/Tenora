import Busboy from "busboy"
import { verifyToken } from "../middleware/jwt"

async function uploadProductImage(request, response, cloudinary ){

    const isTokenValid=verifyToken(request,response)
        if (!isTokenValid){ return; } 

    // create busboy parser 
    let busboy
    try{          
        busboy=Busboy({          // creates busboy instance
            headers: request.headers,    // for image upload important header is :Content-Type: multipart/form-data
            limits:{files:5, fileSize:5*1024*1024}
        })
    }catch{
        response.writeHead(400,{"Content-Type": "application/json"})
        response.end(JSON.stringify({ message:"Invalid image and upload request"}))
        return 
    }

    const uploadedImages = [];      // store info about successfully uploaded images
    const uploadTasks = [];         //store promises representing upload operations that are running or waiting to be completed
    let fileCount = 0;           
    let invalidFile = false;
    let tooLarge = false;
    let tooManyFiles = false;
    let uploadFailed = false;

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    // receive uploaded files most imp part of busboy: the file event 
    busboy.on("file",(fieldName,file,info)=>{      // whenever detect a file in incoming request, execute this call back ,fieldname: name of filed frontend send , file : actual data in stream, info : info about upload file
        fileCount++
        // check field name and image type 
        if(fieldName!=="images"||!allowedTypes.includes(info.mimeType)){   // frontend have to send fieldname using "images" , if another fieldname, situation becomes true.....mimetype check what type of file is being uploaded : xy.jpg is image/jpeg 
            invalidFile=true  
            file.resume()   // tell nodejs to consume and discard this file, and allows reading the request
            return         // invalid file is not processed
        }
        let fileTooLarge= false   // helps to indetify each request 
        file.on("limit",()=>{       // earlier we set limit=5 soo busboy detects that the file exceeds config limit and "triggers" limit event
           fileTooLarge= true
            tooLarge= true
        })  

    // upload image to cloudinary
    const uploadTask= new Promise((resolve,reject)=>{
        const uploadStream= cloudinary.uploader.upload_stream({  //This Cloudinary method creates a stream that can receive image data and upload it directly to Cloudinary
            folder:`tenora/products/${request.tenant.id}`,    // folder specify where image should store in cloudinary(each image will reside in its tenant product id) : tenant ID is tenant123, the folder becomes:tenora/products/tenant123
            resource_type: "image"    //tells uploading a image
        },
        (error,result)=>{
             if (error) {reject(error)    //If something goes wrong, error contains the error
            } else { resolve(result)       // If successful, result contains information about the uploaded image
            }
        }
        )
        file.pipe(uploadStream)   // handles transferring data ->>file is the readable stream provided by Busboyu >pipe connects< these two uploadStream is the writable stream provided by Cloudinary.
    })
    .then(async (result)=>{
        if (fileTooLarge) {
                await cloudinary.uploader.destroy(result.public_id) // if file exceeded the configured size limit, you delete the uploaded image from Cloudinary
                return;
            }

        uploadedImages.push({url : result.secure_url, publicId : result.public_id})
    })

    .catch((error) => {
    console.error("Cloudinary upload error:", error)
    uploadFailed = true  // this tells the backend atleast one of the file is failed 
}) 
    uploadTasks.push(uploadTask)   // keep tack of each upload operation because promise wait for all upload task to settle
})

    // detect more than five files:
    busboy.on("filesLimit", () => {
        tooManyFiles = true
    })

    // finishing 
    busboy.on("close", async()=>{
        await Promise.all(uploadTasks)
        if(fileCount===0 || invalidFile || tooLarge || tooManyFiles || uploadFailed){
            // Delete uploaded images if the request failed
            await Promise.all(uploadedImages.map((image) =>
                    cloudinary.uploader.destroy(image.publicId))
            )
            response.writeHead(400, { "Content-Type": "application/json" });
            response.end(JSON.stringify({
                message: "Image upload failed. Check file type, size and number of images."
            }));

            return;
        }

        // is all files succeds return image detail to frontend 
        response.writeHead(200,{"Content-Type":"application/json"})
        response.end(JSON.stringify({
            message:  "Images uploaded successfully.",
            images: uploadedImages
        }))
    })


busboy.on("error", (error) => {  // if something malformed , invalid formating or encounters and error

        console.error("Busboy error:", error);
        if (!response.headersSent) { response.writeHead(400, {"Content-Type": "application/json" })
            response.end(JSON.stringify({ message: "Could not process image upload." }))
        }
    })

    // Start reading the incoming request
    request.pipe(busboy) //Starts sending request data to Busboy, feeds it the incoming data
}

export default uploadProductImage;

