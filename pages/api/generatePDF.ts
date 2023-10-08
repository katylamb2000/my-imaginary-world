
import PDFKit, { page } from 'pdfkit';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const cmToPoint = (cm: number) => (cm / 2.54) * 72; // Convert cm to points
const pageSizeWithoutBleed = [cmToPoint(20), cmToPoint(20)]; // 20cm x 20cm in points
const bleed = cmToPoint(0.4); // 4mm in points
const pageSizeWithBleed = [pageSizeWithoutBleed[0] + 2 * bleed, pageSizeWithoutBleed[1] + 2 * bleed];
const marginWithSafeArea = 50 + bleed;

const createPDF = async (story: any, title: string, coverImage: string, customFontPath?: string, titleColor?: string, titleSize?: number): Promise<Buffer[]> => {
    const doc = new PDFKit({
        size: pageSizeWithBleed
    });

    let buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));

    if(customFontPath) {
        doc.font(customFontPath|| 'Courier'); // This will set the custom font for the entire document. If you want to switch back to the default font later, use doc.font('Helvetica') or whatever default you'd like.
    } 

// cover page
    console.log('adding cover', title)
        try {
            const coverImageResponse = await axios.get(coverImage, { responseType: 'arraybuffer' });
            const coverImageBuffer = Buffer.from(coverImageResponse.data, 'binary');
            doc.image(coverImageBuffer, 0, 0, {
                fit: [pageSizeWithBleed[0], pageSizeWithBleed[1]]
            });
        

                // Then, render the title on top of the image
           const titleTextOptions = {
            width: pageSizeWithoutBleed[0] - 2 * marginWithSafeArea,
            align: 'center'
        };

            // To vertically center the title, we need to compute its height and then adjust its vertical position accordingly.
            const titleHeight = doc.heightOfString(title, titleTextOptions);
            const verticalPosition = (pageSizeWithBleed[1] - titleHeight) / 2; // This centers the text vertically
    
                // Render the title on top of the image
            doc.fillColor(titleColor || '#FFFFFF') // White text
                .fontSize(titleSize || 40)
                .text(title, marginWithSafeArea, verticalPosition, titleTextOptions);

                // .text(title, marginWithSafeArea, marginWithSafeArea, {
                //     width: pageSizeWithoutBleed[0] - 2 * marginWithSafeArea,
                //     align: 'center'
                // });


        } catch (error) {
            console.error('Error fetching the cover image:', error);
        }

// Process each story page
for (let i = 0; i < Math.min(15, story.length); i++) {
    // for (let i = 0; i < 4; i++) {
    doc.addPage();

// const smallImageUrl = story[i].data.finalSmallImageUrl || story[i].data.smallRoundImageUrl;
    const smallImageUrl = story[i].data.finalSmallImageUrl;

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
    try {
        const responseForSmallImage = await axios.get(smallImageUrl, { responseType: 'arraybuffer' });
        const smallImageBuffer = Buffer.from(responseForSmallImage.data, 'binary');
        doc.image(smallImageBuffer, imageX, imageY, {
            fit: [imageWidth, imageHeight]
        });
    } catch (error) {
        console.error('Error fetching small image:', error);
    }

    doc.addPage();

// // After rendering the right page image
// const fullPageImageUrl = story[i].data.finalImageUrl || story[i].data.imageUrl || 'YOUR_DEFAULT_IMAGE_URL';
// try {
//     const responseForFullPageImage = await axios.get(fullPageImageUrl, { responseType: 'arraybuffer' });
//     const fullPageImageBuffer = Buffer.from(responseForFullPageImage.data, 'binary');
//     doc.image(fullPageImageBuffer, bleed, bleed, {
//         width: pageSizeWithoutBleed[0],
//         height: pageSizeWithoutBleed[1]
//     });

//  if (story[i].data.rightPagetext){
  
//     const rectHeight = 120; // or any other specific height you want for the black bar
//     const bottomMargin = 2;
//     const textPadding = 2; // Space between the top of the rectangle and the start of the text

//     // Drawing the black bar with 50% opacity at the bottom
//     doc.fillOpacity(0.5)
//        .fillColor('black')
//        .rect(marginWithSafeArea, pageSizeWithoutBleed[1] - rectHeight - bottomMargin, pageSizeWithoutBleed[0] - 2 * marginWithSafeArea, rectHeight)
//        .fill();
 
//        const yPosForText = pageSizeWithoutBleed[1] - rectHeight - bottomMargin + textPadding;
 
//     // Rendering the text centered in that bar
//     doc.fillOpacity(1) // Reset opacity for text
//        .fillColor('white')
//        .fontSize(20)
//        .text(story[i].data.rightPagetext, marginWithSafeArea, pageSizeWithoutBleed[1] - rectHeight - bottomMargin, {
//            width: pageSizeWithoutBleed[0] - 2 * marginWithSafeArea,
//            align: 'center',
//            lineGap: 2
//        });
//     }
// } catch (error) {
//     console.error('Error fetching full page image:', error);
// }

// ... your earlier code ...


// Fetch and add the full-page image
const fullPageImageUrl = story[i].data.finalImageUrl || story[i].data.imageUrl || 'YOUR_DEFAULT_IMAGE_URL';
try {
    const responseForFullPageImage = await axios.get(fullPageImageUrl, { responseType: 'arraybuffer' });
    const fullPageImageBuffer = Buffer.from(responseForFullPageImage.data, 'binary');
    doc.image(fullPageImageBuffer, bleed, bleed, {
        width: pageSizeWithoutBleed[0],
        height: pageSizeWithoutBleed[1]
    });
    
    // If there's text to add to this page, proceed
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
           .fillColor('black')
           .rect(marginWithSafeArea, pageSizeWithoutBleed[1] - rectHeight - bottomMargin, pageSizeWithoutBleed[0] - 2 * marginWithSafeArea, rectHeight)
           .fill();

        // Rendering the text centered in the rectangle
        const yPosForText = pageSizeWithoutBleed[1] - rectHeight - bottomMargin + textPadding;
        doc.fillOpacity(1) // Reset opacity for text
           .fillColor('white')
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
        const { story, title, coverImage } = req.body;
        const pdfBuffers = await createPDF(story, title, coverImage);
        const pdfData = Buffer.concat(pdfBuffers);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=story.pdf');
        res.send(pdfData);
    } catch (error) {
        console.error('Error in /api/generatePDF:', error);
        res.status(500).json({ error: 'Failed to generate the PDF.' });
    }
};
