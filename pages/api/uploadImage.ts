import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb, firebaseStorage } from '../../firebaseAdmin';



const uploadImage = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === 'POST') {
        console.log("POST request received");
        const { imageBuffer, imageName, contentType } = req.body;
    
        // Convert the base64 string back to a buffer.
        const buffer = Buffer.from(imageBuffer, 'base64');
    
        // Create a Storage reference.
        const file = firebaseStorage.file(imageName);
    
        // Configure the file's metadata.
        const options = {
            metadata: {
                contentType: contentType,
            },
        };
    
        // Upload the file to Firebase Storage.
        await file.save(buffer, options);
    
        // Get the signed URL for the uploaded image.
        const [signedUrl] = await file.getSignedUrl({
            action: 'read',
            expires: '01-01-3000', // You can set your own expiration date.
        });
    
        // Save the signed URL to Firestore.
        await adminDb.collection('images').add({
            imageUrl: signedUrl,
            imageName: imageName,
            contentType: contentType,
            // uploadedAt: adminDb.Timestamp.now(),
        });
    
        // Send the signed URL as a response.
        res.status(200).json({ imageUrl: signedUrl });
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    
};

export default uploadImage;
