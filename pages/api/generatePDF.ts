
// import PDFKit from 'pdfkit';
// import axios from 'axios';
// import { Readable } from 'stream';
// import { adminDb, firebaseStorage } from '../../firebaseAdmin';
// import { NextApiRequest, NextApiResponse } from 'next';

// const pageSize = 794.48; // 28cm in points
// const margin = 50; // smaller margin for more space
// const textStartPosition = 100;

// const createPDF = async (story: any): Promise<Buffer[]> => {
//     const doc = new PDFKit({
//         size: [pageSize, pageSize] // 28cm x 28cm in points
//     });
//     let buffers: Buffer[] = [];

//     doc.on('data', buffers.push.bind(buffers));

//     // Cover Page
//     doc.fillColor('#000000')
//         .fontSize(50)
//         .text(story[0].data.text, 100, 300)
//         .addPage();

//     // Double Page Spreads
//     for (let i = 1; i < story.length; i++) {
//         console.log('page ==> ', i);

//    // Define the two halves of the page
// const halfPageHeight = pageSize / 2;

// // Draw Green Rectangle for the Top Half
// doc.rect(margin, 0, pageSize - 2 * margin, halfPageHeight)
//    .fill('#00FF00'); // Green

// // Draw Red Rectangle for the Bottom Half
// doc.rect(margin, halfPageHeight, pageSize - 2 * margin, halfPageHeight)
//    .fill('#FF0000'); // Red

// // Center the text in the top green half
// const textWidth = doc.widthOfString(story[i].data.text);
// const textHeight = doc.heightOfString(story[i].data.text, {
//     width: pageSize - 2 * margin
// });

// const textX = (pageSize - textWidth) / 2;
// const textY = (halfPageHeight - textHeight) / 2;

// doc.fillColor('#DE3163')
//    .fontSize(30)
//    .text(story[i].data.text, textX, textY, {
//        width: pageSize - 2 * margin
//    })

//             // console.log('Position after text:', doc.y)

//             .addPage();

//         const smallImageUrl = 'https://media.discordapp.net/attachments/1083423262681350234/1141007317580656672/katy2000_on_a_white_background_in_the_style_of_adam_stower_a_c_863e0d5e-0589-493d-b9bb-211e6caa0ab2.png?width=1060&height=1060';  // Replace with your image URL
//         const imageStartYPosition = pageSize - 100 - margin;
      
//     try {
//         const responseForSmallImage = await axios.get(smallImageUrl, { responseType: 'arraybuffer' });
//         const smallImageBuffer = Buffer.from(responseForSmallImage.data, 'binary');
//         doc.image(smallImageBuffer, margin, imageStartYPosition, {
//             fit: [100, 100],
//             align: 'center',
//             valign: 'center'
//         });
//         console.log('ADDED SMALL IMAGE');
//     } catch (error) {
//         console.error('Error fetching small image:', error);
//     }
//         // Right Page
//         const imageUrl = 'https://media.discordapp.net/attachments/1083423262681350234/1141007317580656672/katy2000_on_a_white_background_in_the_style_of_adam_stower_a_c_863e0d5e-0589-493d-b9bb-211e6caa0ab2.png?width=1060&height=1060';
//         const response = await axios({
//             url: imageUrl,
//             method: 'GET',
//             responseType: 'arraybuffer',
//         });
//         const imageBuffer = Buffer.from(response.data, 'binary');
//         doc.image(imageBuffer, 0, 0, {
//             width: pageSize,
//             height: pageSize
//         });
//         console.log('ADDED FULL PAGE IMAGE', imageBuffer)
//         if (i < story.length - 1) {
//             doc.addPage();
//         }
//     }

//     doc.end();
//     return buffers;
// };

// async function saveToGoogleStorage(pdfData: Buffer, story: any): Promise<string> {
//     const bucketName = 'katys-pdfs';
//     const filename = `${story[0].data.text}-${Date.now()}.pdf`;
//     const file = firebaseStorage.file(`pdfs/${filename}`);
    
//     return new Promise((resolve, reject) => {
//         const blobStream = file.createWriteStream({
//             metadata: {
//                 contentType: 'application/pdf',
//             },
//             resumable: false,
//         });

//         blobStream.on('error', (err: any) => {
//             console.error('Error uploading to GCS:', err);
//             reject(err);
//         });

//         blobStream.on('finish', async () => {
//             try {
//                 // Generate a signed URL for the file
//                 const signedUrls = await file.getSignedUrl({
//                     action: 'read',
//                     expires: '03-17-2025',  // Set the expiration time as per your requirement
//                 });
//                 const signedUrl = signedUrls[0];
//                 resolve(signedUrl);

//                 console.log(signedUrl)
//             } catch (err) {
//                 console.error('Error while generating signed URL:', err);
//                 reject(err);
//             }
//         });

//         blobStream.on('progress', (progress: any) => {
//             console.log(`Uploaded: ${progress.bytesWritten}`);
//         });

//         const bufferStream = new Readable();
//         bufferStream.push(pdfData);
//         bufferStream.push(null);
//         bufferStream.pipe(blobStream);
//     });
// }


// export default async (req: NextApiRequest, res: NextApiResponse) => {
//     try {
//         const { story } = req.body;
    
//         const pdfBuffers = await createPDF(story);
//         const pdfData = Buffer.concat(pdfBuffers);
//         const signedUrl = await saveToGoogleStorage(pdfData, story);

//         console.log('signedUrl', signedUrl)

//         const docRef = adminDb.collection('PDFS').doc('chalks and the moonlings');
//         console.log("DOC REF", docRef)
//         await docRef.set({ signedUrl }, { merge: true });

//         res.status(200).json({ url: signedUrl });
//     } catch (error) {
//         console.error('Error in /api/generatePDF:', error);
//         res.status(500).json({ error: 'An error occurred during the PDF generation.' });
//     }
// };


import PDFKit from 'pdfkit';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const pageSize = 794.48; // 28cm in points
const margin = 100; // smaller margin for more space
const textStartPosition = 100;

const createPDF = async (story: any): Promise<Buffer[]> => {

    const doc = new PDFKit({
        size: [pageSize, pageSize] // 28cm x 28cm in points
    });
    let buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));

    // Cover Page
    doc.fillColor('#000000')
        .fontSize(50)
        .text(story[0].data.text, 100, 300)
        .addPage();

    // Double Page Spreads
    for (let i = 1; i < story.length; i++) {
        console.log('page ==> ', i);

// Define the two halves of the page
const halfPageHeight = pageSize / 2;
const smallImageUrl = 'https://media.discordapp.net/attachments/1083423262681350234/1141007317580656672/katy2000_on_a_white_background_in_the_style_of_adam_stower_a_c_863e0d5e-0589-493d-b9bb-211e6caa0ab2.png?width=1060&height=1060';  // Replace with your image URL
const longImage = 'https://media.discordapp.net/attachments/1082310627151855657/1139624966439043123/katy2000_An_enchanted_forest_with_a_child_protagonist_leading__7b405130-6424-4081-80ff-4bb73424ba3d.png?width=2120&height=1060'
const fullPageImage = 'https://media.discordapp.net/attachments/1082310627151855657/1143878347676459018/katy2000_An_enchanted_forest_with_a_child_protagonist_leading__481f9949-5e2c-4f5c-82bc-37b46faa407c.png?width=1060&height=1060'
// Draw Green Rectangle for the Top Half
doc.rect(margin, margin, pageSize - 2 * margin, halfPageHeight - 2 * margin)
   .fill('#FFFFFF'); // fill from page.data.smallImageBackground. 


// Place small image in the center of the green box
// const imageWidth = 300; // for a small centered image
// const imageHeight = 300; // for a small centered image

const imageWidth = 794.48 // for full width half page image. 
const imageHeight = 445; // for full width half page image. 
const imageX = (pageSize - imageWidth) / 2;
const imageY = ((halfPageHeight - 2 * margin) - imageHeight) / 2 + margin;

try {
    const responseForSmallImage = await axios.get(longImage, { responseType: 'arraybuffer' });
    const smallImageBuffer = Buffer.from(responseForSmallImage.data, 'binary');
    doc.image(smallImageBuffer, imageX, imageY, {
        fit: [imageWidth, imageHeight]
    });
    console.log('ADDED SMALL IMAGE');
} catch (error) {
    console.error('Error fetching small image:', error);
}

// Draw Red Rectangle for the Bottom Half
doc.rect(margin, halfPageHeight + margin, pageSize - 2 * margin, halfPageHeight - 2 * margin)
   .fill('#FFFFFF'); // white

// Center the text in the red half
const textWidth = doc.widthOfString(story[i].data.text);
const textHeight = doc.heightOfString(story[i].data.text, {
    width: pageSize - 2 * margin
});

const textX = margin // centering within the red rectangle
const textY = halfPageHeight + margin + ((halfPageHeight - 2 * margin - textHeight) / 2); // centering vertically

doc.fillColor('#DE3163')
   .fontSize(30)
   .text(story[i].data.text, textX, textY, {
       width: pageSize - 2 * margin
   });

// Only add a new page if it's not the last element
if (i < story.length - 1) {
    doc.addPage();
}

}

doc.end();
return buffers;
}


export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { story } = req.body;
    
        const pdfBuffers = await createPDF(story);
        const pdfData = Buffer.concat(pdfBuffers);

        // Set headers and send the PDF data to the frontend
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=story.pdf'); // 'inline' ensures it'll open in the browser
        res.send(pdfData);
    } catch (error) {
        console.error('Error in /api/generatePDF:', error);
        res.status(500).json({ error: 'An error occurred during the PDF generation.' });
    }
};
