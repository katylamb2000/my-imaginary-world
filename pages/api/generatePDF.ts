import PDFKit from 'pdfkit';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const cmToPoint = (cm: number) => (cm / 2.54) * 72; // Convert cm to points
const pageSizeWithoutBleed = [cmToPoint(20), cmToPoint(20)]; // 20cm x 20cm in points
const bleed = cmToPoint(0.4); // 4mm in points
const pageSizeWithBleed = [pageSizeWithoutBleed[0] + 2 * bleed, pageSizeWithoutBleed[1] + 2 * bleed];
const marginWithSafeArea = 100 + bleed; // original margin + bleed for safe area

const createPDF = async (story: any, title: string): Promise<Buffer[]> => {
    const doc = new PDFKit({
        size: pageSizeWithBleed
    });

    let buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));

    // Title Page
    doc.fillColor('#000000')
        .fontSize(50)
        .text(title, marginWithSafeArea, 300, {
            width: pageSizeWithoutBleed[0] - 2 * marginWithSafeArea
        })
        .addPage();

    // Process each story
    for (let i = 0; i < story.length; i++) {
        doc.addPage();

        const smallImageUrl = story[i].data.smallRoundImageUrl || 'https://...'; // default URL

        const imageWidth = 300;
        const imageHeight = 300;
        const imageX = (pageSizeWithoutBleed[0] - imageWidth) / 2;
        const imageY = (pageSizeWithoutBleed[1] - imageHeight) / 2 + marginWithSafeArea;

        try {
            const responseForSmallImage = await axios.get(smallImageUrl, { responseType: 'arraybuffer' });
            const smallImageBuffer = Buffer.from(responseForSmallImage.data, 'binary');
            doc.image(smallImageBuffer, imageX, imageY, {
                fit: [imageWidth, imageHeight]
            });
        } catch (error) {
            console.error('Error fetching small image:', error);
        }

        doc.fillColor(story[1].data.hexColor || '#DE3163')
           .fontSize(30)
           .text(story[i].data.text, marginWithSafeArea, pageSizeWithoutBleed[1] / 2 + marginWithSafeArea, {
               width: pageSizeWithoutBleed[0] - 2 * marginWithSafeArea
           });

        doc.addPage();

        const fullPageImageUrl = story[i].data.finalImageUrl || story[i].data.imageUrl || 'https://...'; // default URL

        try {
            const responseForFullPageImage = await axios.get(fullPageImageUrl, { responseType: 'arraybuffer' });
            const fullPageImageBuffer = Buffer.from(responseForFullPageImage.data, 'binary');
            doc.image(fullPageImageBuffer, bleed, bleed, {
                width: pageSizeWithoutBleed[0],
                height: pageSizeWithoutBleed[1]
            });
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
        res.status(500).json({ error: 'An error occurred during the PDF generation.' });
    }
};
