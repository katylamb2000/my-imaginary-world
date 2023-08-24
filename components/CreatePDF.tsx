
// import { collection, updateDoc, doc, setDoc } from 'firebase/firestore';
// import { useRouter } from 'next/navigation';
// import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
// import { db, storage, uploadBytes, ref, getDownloadURL } from '../firebase';
// import { useSession } from 'next-auth/react';
// import { useEffect } from 'react';

// interface ImageData {
//   url: string;
//   description: string;
// }

// interface PageData {
//     buttonMessageId: string,
//     buttons: [],
//     imageChoices: string,
//     imagePrompt: string,
//     page: string,
//     pageNumber: number
//     data: any
// }

// interface CreatePDFProps {
//     story: any,
//     storyId: string,
//     fontSizeSize: number,
//     // fontType: string,
   
//   }

// const CreatePDF = ({ story, storyId, fontSizeSize }: CreatePDFProps) => {
//   const router = useRouter();
//   const { data: session } = useSession()

//   useEffect(() => {

//         console.log('story ==>>', story)
//         story.map((page: PageData) => {
//           console.log(page)
//         })

//   }, [story])

//   const createBookPDF = async () => {
//     const pdfDoc = await PDFDocument.create();
//     await Promise.all(story.map((page: PageData) => addPagesToPdf(pdfDoc, page)));
//     openPdf(pdfDoc);
//     // savePdf(pdfDoc)
//   };

//   const addPagesToPdf = async (pdfDoc: PDFDocument, pageData: PageData) => {
//     const page = pdfDoc.addPage([500, 500]);
//     console.log('PAGE DATA ====>', pageData)
//     // const imageUrl = pageData.data.imageChoices;
//     const imageUrl = pageData.data.imageUrl || 'https://media.discordapp.net/attachments/1083423262681350234/1141007317580656672/katy2000_on_a_white_background_in_the_style_of_adam_stower_a_c_863e0d5e-0589-493d-b9bb-211e6caa0ab2.png?width=1060&height=1060';

//     const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());
//     const embeddedImage = await pdfDoc.embedPng(imageBytes);

//     const imageWidth = page.getWidth();
//     const imageHeight = page.getHeight();

//     const imagePositionX = 0;
//     const imagePositionY = 0;

//     page.drawImage(embeddedImage, {
//       x: imagePositionX,
//       y: imagePositionY,
//       width: imageWidth,
//       height: imageHeight,
//     });

//     const text = pageData.data.text;

//     const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
//     // const fontSize = 24;
//     // const textColor = rgb(1, 1, 1);
//     // const font = await pdfDoc.embedFont(fontType);
//     const fontSize = fontSizeSize;
//     // const textColor = fontColor;
//     // Assuming fontColor is a string in the format 'rgb(r, g, b)'
//   // Split the fontColor prop into an array
//   // const rgbValues = fontColor.split(',').map(Number);
//   // Convert each value to a number from 0 to 1 and create a color
//   // const textColor = rgb(rgbValues[0] / 255, rgbValues[1] / 255, rgbValues[2] / 255);
// // Define the RGB values for purple
// const purpleRgbValues = [128, 0, 128]; // RGB values for purple

// // Convert the RGB values to a color using the pdf-lib's rgb function
// const textColor = rgb(purpleRgbValues[0] / 255, purpleRgbValues[1] / 255, purpleRgbValues[2] / 255);



//     const textPositionX = 50;
//     const textPositionY = 100;

//     const options = {
//       x: textPositionX,
//       y: textPositionY,
//       size: fontSize,
//       font: font,
//       color: textColor,
//       opacity: 1,
//       maxWidth: page.getWidth() - 100,
//       align: 'center',
//       wrap: true,
//     };

//     page.drawText(text, options);
//   };

//   const openPdf = async (pdfDoc: PDFDocument) => {
//     const pdfBytes = await pdfDoc.save();
//     const blob = new Blob([pdfBytes], { type: 'application/pdf' });
//     const url = window.URL.createObjectURL(blob);
//     window.open(url);
//   };

//   const savePdf = async (pdfDoc: PDFDocument) => {
//     const pdfBytes = await pdfDoc.save();
//     const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  

//     const fileRef = ref(storage, 'pdfs/myGeneratedPDF.pdf');
  
//     // Convert blob to file (because firebase storage deals with File and not Blob)
//     const file = new File([blob], 'myGeneratedPDF.pdf');
  
//     const snapshot = await uploadBytes(fileRef, file);

//        // Get download URL
//   const url = await getDownloadURL(snapshot.ref);

//   // Save the URL to your Firebase database
// //   const docRef = doc(db, "users", session!.user "myGeneratedPDF");
// //   const docRef = collection(db, "users", session?.user?.email!, 'characters' ), {
// //   await updateDoc(docRef, { url });

//   const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, );
//   const updatedPage = await updateDoc(docRef, {
//     pdf: url
//   });

//   console.log('Uploaded a blob or file!', snapshot);
//     }
  

//   const goToGelatoStore = () => {
//     router.push('/gelatoProductsCatalog');
//   };

//   return (
//     <div className="w-full bg-gray-50 h-1/6 text-center flex gap-6">
//       <button
//         className="p-4 rounded-lg bg-purple-500 text-white text-center my-6 hover:shadow-xl hover:bg-purple-600"
//         onClick={createBookPDF}>
//         Create PDF
//       </button>

//       <button
//         className="p-4 rounded-lg bg-purple-500 text-white text-center my-6 hover:shadow-xl hover:bg-purple-600"
//         onClick={goToGelatoStore}>
//         Add products
//       </button>

    
//     </div>
//   );
// };

// export default CreatePDF;
import React, { useEffect } from 'react';
import { PDFDocument, StandardFonts, rgb, PDFFont } from 'pdf-lib';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { collection, updateDoc, doc, setDoc } from 'firebase/firestore';

import { db, storage, uploadBytes, ref, getDownloadURL } from '../firebase';


interface ImageData {
  url: string;
  description: string;
}

interface PageData {

  data: any;
}

interface CreatePDFProps {
  story: PageData[];
  storyId: string;
  fontSizeSize: number;
}

const wrapText = (text: string, fontSize: number, maxWidth: number, font: PDFFont): string => {
      console.log('page width', maxWidth, );
  const words = text.split(' ');
  let lines = [];
  let line = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = line + word + ' ';
    const testLineWidth = font.widthOfTextAtSize(testLine.replace(' ', ''), fontSize);

    
    if (testLineWidth > maxWidth && line.trim() !== '') {
        lines.push(line.trim());
        line = word + ' ';
    } else if (testLineWidth > maxWidth) {
        // This handles the scenario where a single word is longer than the maxWidth.
        // In this case, the word is pushed to the lines array as is.
        lines.push(word);
        line = '';
    } else {
        line = testLine;
    }
  }

  if (line.trim() !== '') {
    lines.push(line.trim());
  }
  
  return lines.join('');
};





const CreatePDF = ({ story, storyId, fontSizeSize }: CreatePDFProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    console.log('story ==>>', story);
    story.map((page: PageData) => {
      console.log(page);
    });
  }, [story]);

  const coverImageData: ImageData = {
    url: 'https://media.discordapp.net/attachments/1083423262681350234/1141007317580656672/katy2000_on_a_white_background_in_the_style_of_adam_stower_a_c_863e0d5e-0589-493d-b9bb-211e6caa0ab2.png?width=1060&height=1060',

    description: 'Cover Image',
  };

  const backCoverImageData: ImageData = {
    url: 'https://media.discordapp.net/attachments/1083423262681350234/1141007317580656672/katy2000_on_a_white_background_in_the_style_of_adam_stower_a_c_863e0d5e-0589-493d-b9bb-211e6caa0ab2.png?width=1060&height=1060',

    description: 'Back Cover Image',
  };

  const addCoverPage = async (pdfDoc: PDFDocument, coverImageData: ImageData) => {
    console.log('in add cover page')
    const page = pdfDoc.addPage();
    const imageBytes = await fetch(coverImageData.url).then((res) => res.arrayBuffer());
    const image = await pdfDoc.embedPng(imageBytes);
    page.drawImage(image, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() });
  };

  const addPagesToPdf = async (pdfDoc: PDFDocument, pageData: PageData) => {
    console.log('in add pages');
    
    const leftPage = pdfDoc.addPage();
    const text = pageData.data.text;
    console.log('text', text);

    
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const purpleRgbValues = [128, 0, 128];
    const textColor = rgb(purpleRgbValues[0] / 255, purpleRgbValues[1] / 255, purpleRgbValues[2] / 255);
    
    const fontSizeSize = 28;
    const maxWidth = leftPage.getWidth();
    // const wrappedText = wrapText(text, fontSizeSize, maxWidth, font);
    const wrappedText = text
    const textWidth = font.widthOfTextAtSize(wrappedText, fontSizeSize);
    const textPositionX = (leftPage.getWidth() - maxWidth) / 3;
  
    const lines = wrappedText.split('  ').length;
    const textHeight = lines * (fontSizeSize * 3);
    
    const pageHeight = leftPage.getHeight();
    const topHalfCenterY = pageHeight * 3 / 4;
    const textPositionY = topHalfCenterY - (textHeight / 2);
    
    leftPage.drawText(wrappedText, {
      x: textPositionX + 50,
      y: textPositionY,
      size: fontSizeSize,
      font: font,
      color: textColor,
      opacity: 1,
      maxWidth: maxWidth,
    });
    
    // ... (rest of your code for images and other content)
  
    const smallImageBytes = await fetch(pageData.data.imageUrl || 'https://media.discordapp.net/attachments/1083423262681350234/1141007317580656672/katy2000_on_a_white_background_in_the_style_of_adam_stower_a_c_863e0d5e-0589-493d-b9bb-211e6caa0ab2.png?width=1060&height=1060')
    .then((res) => res.arrayBuffer());
    const smallImage = await pdfDoc.embedPng(smallImageBytes);
    leftPage.drawImage(smallImage, { x: 100, y: 100, width: 300, height: 300 });
  // };
  
    // Right page (Full Image)
    const rightPage = pdfDoc.addPage();
    const imageBytes = await fetch(pageData.data.imageUrl || 'https://media.discordapp.net/attachments/1083423262681350234/1141007317580656672/katy2000_on_a_white_background_in_the_style_of_adam_stower_a_c_863e0d5e-0589-493d-b9bb-211e6caa0ab2.png?width=1060&height=1060').then((res) => res.arrayBuffer());
    const fullImage = await pdfDoc.embedPng(imageBytes);
    rightPage.drawImage(fullImage, { x: 0, y: 0, width: rightPage.getWidth(), height: rightPage.getHeight() });
  };

  const addBackCover = async (pdfDoc: PDFDocument, backCoverImageData: ImageData) => {
    console.log('in add back pages')
    const page = pdfDoc.addPage();
    const imageBytes = await fetch(backCoverImageData.url).then((res) => res.arrayBuffer());
    const image = await pdfDoc.embedPng(imageBytes);
    page.drawImage(image, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() });
  };

  const createBookPDF = async () => {
    console.log('hit create pdf')
    const pdfDoc = await PDFDocument.create();

    // Add Cover Page
    await addCoverPage(pdfDoc, coverImageData);

    // Add Inside Pages (total 28 pages, 14 pairs)
    for (let i = 0; i < 14 && i < story.length; i++) {
      await addPagesToPdf(pdfDoc, story[i]);
    }

    // Add Back Cover
    await addBackCover(pdfDoc, backCoverImageData);

    openPdf(pdfDoc);
  };

  const openPdf = async (pdfDoc: PDFDocument) => {
    console.log('in open pdf')
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  };

  const goToGelatoStore = () => {
    router.push('/gelatoProductsCatalog');
  };

  return (
    <div className="w-full bg-gray-50 h-1/6 text-center flex gap-6">
      <button
        className="p-4 rounded-lg bg-purple-500 text-white text-center my-6 hover:shadow-xl hover:bg-purple-600"
        onClick={createBookPDF}
      >
        Create PDF
      </button>
      <button
        className="p-4 rounded-lg bg-purple-500 text-white text-center my-6 hover:shadow-xl hover:bg-purple-600"
        onClick={goToGelatoStore}
      >
        Add products
      </button>
    </div>
  );
};

export default CreatePDF;
