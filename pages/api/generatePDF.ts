// import PDFKit, { page } from 'pdfkit';
// import axios from 'axios';
// import { NextApiRequest, NextApiResponse } from 'next';
// import { adminDb, firebaseStorage } from '../../firebaseAdmin';


// const cmToPoint = (cm: number) => (cm / 2.54) * 72; // Convert cm to points
// const pageSizeWithoutBleed = [cmToPoint(20), cmToPoint(20)]; // 20cm x 20cm in points
// const bleed = cmToPoint(0.4); // 4mm in points
// const pageSizeWithBleed = [pageSizeWithoutBleed[0] + 2 * bleed, pageSizeWithoutBleed[1] + 2 * bleed];
// const marginWithSafeArea = 50 + bleed;


// const createPDF = async (story: any, title: string, coverImage: string, signatureLineOne?: string, signatureLineTwo?: string): Promise<Buffer[]> => {
   
// const coverSpreadWidth = 2 * pageSizeWithBleed[0];
// const coverSpreadSize = [coverSpreadWidth, pageSizeWithBleed[1]];

// const doc = new PDFKit({
//     size: coverSpreadSize
// });

// let buffers: Buffer[] = [];
// doc.on('data', buffers.push.bind(buffers));
// doc.font('Courier');

// console.log('adding cover just the title NOW PLUS SIG ==>', title);

// try {
//     const coverImageResponse = await axios.get(coverImage, { responseType: 'arraybuffer' });
//     const coverImageBuffer = Buffer.from(coverImageResponse.data, 'binary');

//     // Start the cover image from the midpoint so it only appears on the right half
//     doc.image(coverImageBuffer, coverSpreadWidth / 2, 0, {
//         fit: [pageSizeWithBleed[0], pageSizeWithBleed[1]]
//     });

//         // Compute title height to vertically center it
//         const titleHeight = doc.heightOfString(title, titleTextOptions);
//         const verticalPosition = (coverPageSizeWithBleed[1] - titleHeight) / 2;

//         // Draw the title
//         doc.fillColor("#000000")
//            .fontSize(40)
//            .text(title, coverPageSizeWithBleed[0] / 2 - 300, verticalPosition, { 
//                 width: 600,
//                 align: 'center'
//             });

//         if (signatureLineOne && signatureLineTwo) {
//             // Insert the signature lines
//             console.log('adding signature!!!!', signatureLineOne, signatureLineTwo);
//             doc.fillColor('white')
//                .fontSize(16) 
//                .text(signatureLineOne, (coverPageSizeWithBleed[0] / 2) - 300, coverPageSizeWithBleed[1] - 150, { width: 600, align: 'center' })
//                .text(signatureLineTwo, (coverPageSizeWithBleed[0] / 2) - 300, coverPageSizeWithBleed[1] - 130, { width: 600, align: 'center' });
//         }

//     } catch (error) {
//         console.error('Error fetching the cover image:', error);
//     }

//     // Add subsequent pages with standard size after the cover
//     // doc.addPage({ size: pageSizeWithBleed });

//     // ... Rest of the code for adding inside pages ...

// // Process each story page
// // for (let i = 0; i < Math.min(15, story.length); i++) {
//  for (let i = 0; i < 3; i++) {
//     doc.addPage({ size: pageSizeWithBleed });

// // const smallImageUrl = story[i].data.finalSmallImageUrl || story[i].data.smallRoundImageUrl;
//     const smallImageUrl = story[i].data.finalSmallImageUrl ;

//     const imageWidth = 300;
//     const imageHeight = 300;
//     const imageX = (pageSizeWithoutBleed[0] - imageWidth) / 2;
//     const imageY = (pageSizeWithoutBleed[1] / 4) - (imageHeight / 2) + marginWithSafeArea;
//         console.log(story[i].data.hexTextColor)
    
//         doc.fillColor(story[i].data.hexTextColor || '#DE3163')
//         .fontSize(20);

//     const text = story[i].data.text;
//     const textWidth = pageSizeWithoutBleed[0] - 2 * marginWithSafeArea;

//     // Compute text height by writing it off the page
//     const initialY = doc.y;
//     doc.text(text, -1000, -1000, { width: textWidth, align: 'center' });
//     const textHeight = doc.y - initialY;

//     doc.y = initialY; // Reset Y position

//     const maxAllowedHeight = pageSizeWithoutBleed[1] / 2 - marginWithSafeArea;
//     if (textHeight > maxAllowedHeight) {
//         const scaleFactor = maxAllowedHeight / textHeight;
//         doc.fontSize(30 * scaleFactor);
//     }

//     doc.text(text, marginWithSafeArea, (3 * pageSizeWithoutBleed[1] / 4) - marginWithSafeArea, {
//         width: textWidth,
//         align: 'center',
//         lineGap: 2
        
//     });
    
//     console.log('adding left page', i)
//     if (smallImageUrl){
//     try {
//         const responseForSmallImage = await axios.get(smallImageUrl, { responseType: 'arraybuffer' });
//         const smallImageBuffer = Buffer.from(responseForSmallImage.data, 'binary');
//         doc.image(smallImageBuffer, imageX, imageY, {
//             fit: [imageWidth, imageHeight]
//         });
//     } catch (error) {
//         console.error('Error fetching small image:', error);
//     }}

//     doc.addPage({ size: pageSizeWithBleed });

// // Fetch and add the full-page image
// const fullPageImageUrl = story[i].data.finalImageUrl || story[i].data.imageUrl || 'YOUR_DEFAULT_IMAGE_URL';
// try {
//     const responseForFullPageImage = await axios.get(fullPageImageUrl, { responseType: 'arraybuffer' });
//     const fullPageImageBuffer = Buffer.from(responseForFullPageImage.data, 'binary');
//     doc.image(fullPageImageBuffer, bleed, bleed, {
//         width: pageSizeWithoutBleed[0],
//         height: pageSizeWithoutBleed[1]
//     });
    
//     // If there's Right page text to add to this page, proceed
//     if (story[i].data.rightPagetext) {
//         const rectHeight = pageSizeWithoutBleed[1] / 4; // Reserve 1/5 of the page height for text
//         const bottomMargin = bleed;
//         const textPadding = 5; // Space between the top of the rectangle and the start of the text

//         // Calculate text height
//         const lineGap = 2;
//         const initialY = doc.y;
//         doc.text(story[i].data.rightPagetext, -1000, -1000, {
//             width: pageSizeWithoutBleed[0] - 2 * marginWithSafeArea,
//             align: 'center',
//             lineGap: lineGap
//         });
//         const textHeight = doc.y - initialY;
//         doc.y = initialY; // Reset Y position
        
//         // Scale font size if necessary
//         const maxAllowedHeight = rectHeight - 2 * textPadding; // minus top and bottom padding
//         if (textHeight > maxAllowedHeight) {
//             const scaleFactor = maxAllowedHeight / textHeight;
//             doc.fontSize(20 * scaleFactor); // Scale down
//         } else {
//             doc.fontSize(20); // Default size
//         }

//         // Drawing the semi-transparent black rectangle
//         doc.fillOpacity(0.5)
//            .fillColor('white')
//            .rect(marginWithSafeArea, pageSizeWithoutBleed[1] - rectHeight - bottomMargin, pageSizeWithoutBleed[0] - 2 * marginWithSafeArea, rectHeight)
//            .fill();

//         // Rendering the text centered in the rectangle
//         const yPosForText = pageSizeWithoutBleed[1] - rectHeight - bottomMargin + textPadding;
//         doc.fillOpacity(1) // Reset opacity for text
//            .fillColor('#DE3163')
//            .text(story[i].data.rightPagetext, marginWithSafeArea, yPosForText, {
//                width: pageSizeWithoutBleed[0] - 2 * marginWithSafeArea,
//                align: 'center',
//                lineGap: lineGap
//            });
//             }
//         } catch (error) {
//             console.error('Error fetching full page image:', error);
//         }
//         }
//             doc.end();
//             return buffers;
//         };

import PDFKit from 'pdfkit';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb, firebaseStorage } from '../../firebaseAdmin';

const cmToPoint = (cm: number) => (cm / 2.54) * 72; // Convert cm to points
const pageSizeWithoutBleed = [cmToPoint(20), cmToPoint(20)]; // 20cm x 20cm in points
const bleed = cmToPoint(0.4); // 4mm in points
const pageSizeWithBleed = [pageSizeWithoutBleed[0] + 2 * bleed, pageSizeWithoutBleed[1] + 2 * bleed];
const marginWithSafeArea = 50 + bleed;

const createPDF = async (story: any, title: string, coverImage: string, signatureLineOne?: string, signatureLineTwo?: string): Promise<Buffer[]> => {
    const coverSpreadWidth = 2 * pageSizeWithBleed[0];
    const coverSpreadSize = [coverSpreadWidth, pageSizeWithBleed[1]];

    const doc = new PDFKit({
        size: coverSpreadSize
    });

    let buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.font('Courier');

    console.log('adding cover just the title NOW PLUS SIG ==>', title);

    try {
        const coverImageResponse = await axios.get(coverImage, { responseType: 'arraybuffer' });
        const coverImageBuffer = Buffer.from(coverImageResponse.data, 'binary');

        // Start the cover image from the midpoint so it only appears on the right half
        doc.image(coverImageBuffer, coverSpreadWidth / 2, 0, {
            fit: [pageSizeWithBleed[0], pageSizeWithBleed[1]]
        });

           // Compute title height to vertically center it
           const titleTextOptions = {
            width: pageSizeWithoutBleed[0] - 2 * marginWithSafeArea,
            align: 'center'
        };

        const titleHeight = doc.heightOfString(title, titleTextOptions);
        const verticalPosition = (pageSizeWithBleed[1] - titleHeight) / 2;

        // Adjust the title's horizontal position to be centered on the right side
        const titleHorizontalPosition = (3 * coverSpreadWidth / 4) - (titleTextOptions.width / 2);

        // Draw the title
        doc.fillColor("#000000")
           .fontSize(40)
           .text(title, titleHorizontalPosition, verticalPosition, titleTextOptions);


        if (signatureLineOne && signatureLineTwo) {
            // Insert the signature lines
            const signatureHorizontalPosition = (3 * coverSpreadWidth / 4); // Set it to the same position as title for now
        
            doc.fillColor('white')
               .fontSize(16)
               .text(signatureLineOne, signatureHorizontalPosition, pageSizeWithBleed[1] - 150, { width: 300, align: 'center' }) // Reduced width to 300 for better centering
               .text(signatureLineTwo, signatureHorizontalPosition, pageSizeWithBleed[1] - 130, { width: 300, align: 'center' });  // Reduced width to 300 for better centering
        }

    } catch (error) {
        console.error('Error fetching the cover image:', error);
    }

    // Add subsequent pages with standard size after the cover
    doc.addPage({ size: pageSizeWithBleed });
// Process each story page
// for (let i = 0; i < Math.min(15, story.length); i++) {
 for (let i = 0; i < 3; i++) {
    doc.addPage({ size: pageSizeWithBleed });

// const smallImageUrl = story[i].data.finalSmallImageUrl || story[i].data.smallRoundImageUrl;
    const smallImageUrl = story[i].data.finalSmallImageUrl ;

    const imageWidth = 300;
    const imageHeight = 300;
    const imageX = (pageSizeWithoutBleed[0] - imageWidth) / 2;
    const imageY = (pageSizeWithoutBleed[1] / 4) - (imageHeight / 2) + marginWithSafeArea;
        console.log(story[i].data.hexTextColor)
    
        doc.fillColor(story[i].data.hexTextColor || '#DE3163')
        .fontSize(20);

    const text = story[i].data.text;
    const textWidth = pageSizeWithoutBleed[0] - 2 * marginWithSafeArea;

    // Compute text height by writing it off the page
    const initialY = doc.y;
    doc.text(text, -1000, -1000, { width: textWidth, align: 'center' });
    const textHeight = doc.y - initialY;

    doc.y = initialY; // Reset Y position

    const maxAllowedHeight = pageSizeWithoutBleed[1] / 2 - marginWithSafeArea;
    if (textHeight > maxAllowedHeight) {
        const scaleFactor = maxAllowedHeight / textHeight;
        doc.fontSize(30 * scaleFactor);
    }

    doc.text(text, marginWithSafeArea, (3 * pageSizeWithoutBleed[1] / 4) - marginWithSafeArea, {
        width: textWidth,
        align: 'center',
        lineGap: 2
        
    });
    
    console.log('adding left page', i)
    if (smallImageUrl){
    try {
        const responseForSmallImage = await axios.get(smallImageUrl, { responseType: 'arraybuffer' });
        const smallImageBuffer = Buffer.from(responseForSmallImage.data, 'binary');
        doc.image(smallImageBuffer, imageX, imageY, {
            fit: [imageWidth, imageHeight]
        });
    } catch (error) {
        console.error('Error fetching small image:', error);
    }}

    doc.addPage({ size: pageSizeWithBleed });

// Fetch and add the full-page image
const fullPageImageUrl = story[i].data.finalImageUrl || story[i].data.imageUrl || 'YOUR_DEFAULT_IMAGE_URL';
try {
    const responseForFullPageImage = await axios.get(fullPageImageUrl, { responseType: 'arraybuffer' });
    const fullPageImageBuffer = Buffer.from(responseForFullPageImage.data, 'binary');
    doc.image(fullPageImageBuffer, bleed, bleed, {
        width: pageSizeWithoutBleed[0],
        height: pageSizeWithoutBleed[1]
    });
    
    // If there's Right page text to add to this page, proceed
    if (story[i].data.rightPagetext) {
        const rectHeight = pageSizeWithoutBleed[1] / 4; // Reserve 1/5 of the page height for text
        const bottomMargin = bleed;
        const textPadding = 5; // Space between the top of the rectangle and the start of the text

        // Calculate text height
        const lineGap = 2;
        const initialY = doc.y;
        doc.text(story[i].data.rightPagetext, -1000, -1000, {
            width: pageSizeWithoutBleed[0] - 2 * marginWithSafeArea,
            align: 'center',
            lineGap: lineGap
        });
        const textHeight = doc.y - initialY;
        doc.y = initialY; // Reset Y position
        
        // Scale font size if necessary
        const maxAllowedHeight = rectHeight - 2 * textPadding; // minus top and bottom padding
        if (textHeight > maxAllowedHeight) {
            const scaleFactor = maxAllowedHeight / textHeight;
            doc.fontSize(20 * scaleFactor); // Scale down
        } else {
            doc.fontSize(20); // Default size
        }

        // Drawing the semi-transparent black rectangle
        doc.fillOpacity(0.5)
           .fillColor('white')
           .rect(marginWithSafeArea, pageSizeWithoutBleed[1] - rectHeight - bottomMargin, pageSizeWithoutBleed[0] - 2 * marginWithSafeArea, rectHeight)
           .fill();

        // Rendering the text centered in the rectangle
        const yPosForText = pageSizeWithoutBleed[1] - rectHeight - bottomMargin + textPadding;
        doc.fillOpacity(1) // Reset opacity for text
           .fillColor('#DE3163')
           .text(story[i].data.rightPagetext, marginWithSafeArea, yPosForText, {
               width: pageSizeWithoutBleed[0] - 2 * marginWithSafeArea,
               align: 'center',
               lineGap: lineGap
           });
            }
        } catch (error) {
            console.error('Error fetching full page image:', error);
        }
        }

    doc.end();
    return buffers;
};



export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // const { story, title, coverImage, session, storyId, } = req.body;
        // const pdfBuffers = await createPDF(story, title, coverImage, session, storyId,);
        const { story, title, coverImage, signatureLineOne, signatureLineTwo, session, storyId } = req.body;
        console.log('these are signature!!!!', signatureLineOne, signatureLineTwo)
  
                // 1. Generate the PDF
                const pdfBuffers = await createPDF(story, title, coverImage, signatureLineOne, signatureLineTwo);
                const pdfData = Buffer.concat(pdfBuffers);
        
                // 2. Upload to Firebase Storage
                const pdfFileName = `${Date.now()}.pdf`;
                const pdfFile = firebaseStorage.file(`pdfFiles/${pdfFileName}`);
        
                const blobStream = pdfFile.createWriteStream();
        
                let signedUrl = '';
        
                await new Promise<void>((resolve, reject) => {
                    blobStream.on('error', (err) => {
                        console.error(err);
                        reject(err);
                    });
        
                    blobStream.on('finish', async () => {
                        // 3. Obtain a Signed URL
                        console.log('we have a finished blobstream')
                        const [url] = await pdfFile.getSignedUrl({
                            action: 'read',
                            expires: '03-17-2025',
                        });
        
                        signedUrl = url;
                        resolve();
                    });

                    console.log('signed url', signedUrl)
        
                    // Write the PDF to storage
                    blobStream.end(pdfData);
                });
                
                // 4. Save URL to Firestore (modify this part to match your Firestore structure for storing PDF URLs)
                console.log("About to update Firestore with URL:", signedUrl);

                const storyRef = adminDb
                    .collection('users')
                    .doc(session.user.email)
                    .collection('storys')
                    .doc(storyId); // Assuming you have the correct storyId
        
                    try {
                        await storyRef.set({ pdfUrl32: signedUrl }, { merge: true });
                    } catch (error) {
                        console.error("Error updating/creating Firestore document:", error);
                    }
                    
        
                // 5. Respond to Client
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'inline; filename=story.pdf');
                res.send(pdfData);
            } catch (error) {
                console.error('Error generating and saving the PDF:', error);
                res.status(500).json({ error: 'Failed to generate and save the PDF.' });
            }
        }
        
