// import PDFKit from 'pdfkit';
// import axios from 'axios';
// import { NextApiRequest, NextApiResponse } from 'next';

// const cmToPoint = (cm: number) => (cm / 2.54) * 72; // Convert cm to points
// const pageSizeWithoutBleed = [cmToPoint(20), cmToPoint(20)]; // 20cm x 20cm in points
// const bleed = cmToPoint(0.4); // 4mm in points
// const pageSizeWithBleed = [pageSizeWithoutBleed[0] + 2 * bleed, pageSizeWithoutBleed[1] + 2 * bleed];
// const marginWithSafeArea = 50 + bleed;

// const createPDF = async (story: any, title: string): Promise<Buffer[]> => {
//     const doc = new PDFKit({
//         size: pageSizeWithBleed
//     });

//     let buffers: Buffer[] = [];
//     doc.on('data', buffers.push.bind(buffers));

//     // Title Page
//     doc.fillColor('#000000')
//         .fontSize(40)
//         .text(title, marginWithSafeArea, 300, {
//             width: pageSizeWithoutBleed[0] - 2 * marginWithSafeArea
//         });

// // Process each story
// for (let i = 0; i < Math.min(15, story.length); i++) {
//     doc.addPage();
//     console.log('adding', story[i]);

//     const smallImageUrl = story[i].data.smallRoundImageUrl || 'YOUR_DEFAULT_IMAGE_URL';
//     const imageWidth = 300;
//     const imageHeight = 300;
//     const imageX = (pageSizeWithoutBleed[0] - imageWidth) / 2;
//     const imageY = (pageSizeWithoutBleed[1] / 4) - (imageHeight / 2) + marginWithSafeArea;

//     doc.fillColor(story[i].data.hexColor || '#DE3163')
//         .fontSize(20);

//     const text = story[i].data.text;
//     const textWidth = pageSizeWithoutBleed[0] - 2 * marginWithSafeArea;

//     // Compute text height by writing it off the page
//     const initialY = doc.y;
//     doc.text(text, -1000, -1000, { width: textWidth });
//     const textHeight = doc.y - initialY;

//     doc.y = initialY; // Reset Y position

//     const maxAllowedHeight = pageSizeWithoutBleed[1] / 2 - marginWithSafeArea;
//     if (textHeight > maxAllowedHeight) {
//         const scaleFactor = maxAllowedHeight / textHeight;
//         doc.fontSize(30 * scaleFactor);
//     }

//     doc.text(text, marginWithSafeArea, (3 * pageSizeWithoutBleed[1] / 4) - marginWithSafeArea, {
//         width: textWidth
//     });

//         try {
//             const responseForSmallImage = await axios.get(smallImageUrl, { responseType: 'arraybuffer' });
//             const smallImageBuffer = Buffer.from(responseForSmallImage.data, 'binary');
//             doc.image(smallImageBuffer, imageX, imageY, {
//                 fit: [imageWidth, imageHeight]
//             });
//         } catch (error) {
//             console.error('Error fetching small image:', error);
//         }

//         doc.addPage();
//         const fullPageImageUrl = story[i].data.finalImageUrl || story[i].data.imageUrl || 'YOUR_DEFAULT_IMAGE_URL';
//         try {
//             const responseForFullPageImage = await axios.get(fullPageImageUrl, { responseType: 'arraybuffer' });
//             const fullPageImageBuffer = Buffer.from(responseForFullPageImage.data, 'binary');
//             doc.image(fullPageImageBuffer, bleed, bleed, {
//                 width: pageSizeWithoutBleed[0],
//                 height: pageSizeWithoutBleed[1]
//             });
//         } catch (error) {
//             console.error('Error fetching full page image:', error);
//         }

//         doc.fillColor(story[i].data.rightPageHexColor || '#FFFFFF')
//         .fontSize(30)
//         .text(story[i].data.rightPagetext, marginWithSafeArea, pageSizeWithoutBleed[1] / 2 + marginWithSafeArea, {
//             width: pageSizeWithoutBleed[0] - 2 * marginWithSafeArea
//         });
//     }

//     doc.end();
//     return buffers;
// };

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//     try {
//         const { story, title } = req.body;
//         const pdfBuffers = await createPDF(story, title);
//         const pdfData = Buffer.concat(pdfBuffers);

//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', 'inline; filename=story.pdf');
//         res.send(pdfData);
//     } catch (error) {
//         console.error('Error in /api/generatePDF:', error);
//         res.status(500).json({ error: 'Failed to generate the PDF.' });
//     }
// };
import PDFKit from 'pdfkit';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const cmToPoint = (cm: number) => (cm / 2.54) * 72; // Convert cm to points
const pageSizeWithoutBleed = [cmToPoint(20), cmToPoint(20)]; // 20cm x 20cm in points
const bleed = cmToPoint(0.4); // 4mm in points
const pageSizeWithBleed = [pageSizeWithoutBleed[0] + 2 * bleed, pageSizeWithoutBleed[1] + 2 * bleed];
const marginWithSafeArea = 50 + bleed;

const createPDF = async (story: any, title: string): Promise<Buffer[]> => {
    const doc = new PDFKit({
        size: pageSizeWithBleed
    });

    let buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));

    // Title Page
    doc.fillColor('#000000')
        .fontSize(40)
        .text(title, marginWithSafeArea, 300, {
            width: pageSizeWithoutBleed[0] - 2 * marginWithSafeArea
        });

    // Process each story
  // ... [Beginning of the code remains unchanged]

// Process each story
for (let i = 0; i < Math.min(15, story.length); i++) {
    doc.addPage();

    const smallImageUrl = story[i].data.smallRoundImageUrl || 'YOUR_DEFAULT_IMAGE_URL';
    const imageWidth = 300;
    const imageHeight = 300;
    const imageX = (pageSizeWithoutBleed[0] - imageWidth) / 2;
    const imageY = (pageSizeWithoutBleed[1] / 4) - (imageHeight / 2) + marginWithSafeArea;

    doc.fillColor(story[i].data.hexColor || '#DE3163')
        .fontSize(20);

    const text = story[i].data.text;
    const textWidth = pageSizeWithoutBleed[0] - 2 * marginWithSafeArea;

    // Compute text height by writing it off the page
    const initialY = doc.y;
    doc.text(text, -1000, -1000, { width: textWidth });
    const textHeight = doc.y - initialY;

    doc.y = initialY; // Reset Y position

    const maxAllowedHeight = pageSizeWithoutBleed[1] / 2 - marginWithSafeArea;
    if (textHeight > maxAllowedHeight) {
        const scaleFactor = maxAllowedHeight / textHeight;
        doc.fontSize(30 * scaleFactor);
    }

    doc.text(text, marginWithSafeArea, (3 * pageSizeWithoutBleed[1] / 4) - marginWithSafeArea, {
        width: textWidth
    });

    try {
        const responseForSmallImage = await axios.get(smallImageUrl, { responseType: 'arraybuffer' });
        const smallImageBuffer = Buffer.from(responseForSmallImage.data, 'binary');
        doc.image(smallImageBuffer, imageX, imageY, {
            fit: [imageWidth, imageHeight]
        });
    } catch (error) {
        console.error('Error fetching small image:', error);
    }


// ... [Rest of the code remains unchanged]


        // ... [Rest of your story processing]

        doc.addPage();
        const fullPageImageUrl = story[i].data.finalImageUrl || story[i].data.imageUrl || 'YOUR_DEFAULT_IMAGE_URL';
        try {
            const responseForFullPageImage = await axios.get(fullPageImageUrl, { responseType: 'arraybuffer' });
            const fullPageImageBuffer = Buffer.from(responseForFullPageImage.data, 'binary');
            doc.image(fullPageImageBuffer, bleed, bleed, {
                width: pageSizeWithoutBleed[0],
                height: pageSizeWithoutBleed[1]
            });
            
            const text = story[i].data.rightPageText;
            const textWidth = pageSizeWithoutBleed[0] - 2 * marginWithSafeArea;
            const textHeight = 30 * 1.2; // Assuming 30 as font size

            const startY = pageSizeWithoutBleed[1] - textHeight - 4;
            doc.fillColor('rgba(0,0,0,0.5)').rect(bleed, startY, pageSizeWithoutBleed[0], textHeight).fill();

            const textWidthActual = doc.widthOfString(text);
            const textX = (pageSizeWithoutBleed[0] - textWidthActual) / 2;

            doc.fillColor('#FFFFFF').fontSize(30).text(text, textX + bleed, startY + 4);

        } catch (error) {
            console.error('Error fetching full page image:', error);
        }
    }

    doc.end();
    return buffers;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { story, title } = req.body;
        const pdfBuffers = await createPDF(story, title);
        const pdfData = Buffer.concat(pdfBuffers);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=story.pdf');
        res.send(pdfData);
    } catch (error) {
        console.error('Error in /api/generatePDF:', error);
        res.status(500).json({ error: 'Failed to generate the PDF.' });
    }
};
