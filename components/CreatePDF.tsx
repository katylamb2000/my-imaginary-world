
import { collection, updateDoc, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { db, storage, uploadBytes, ref, getDownloadURL } from '../firebase';
import { useSession } from 'next-auth/react';

interface ImageData {
  url: string;
  description: string;
}

interface PageData {
    buttonMessageId: string,
    buttons: [],
    imageChoices: string,
    imagePrompt: string,
    page: string,
    pageNumber: number
    data: any
}

interface CreatePDFProps {
    story: any,
    storyId: string,
    fontSizeSize: number,
    // fontType: string,
    fontColor: string
  }

const CreatePDF = ({ story, storyId, fontSizeSize, fontColor }: CreatePDFProps) => {
  const router = useRouter();
  const { data: session } = useSession()

  const createBookPDF = async () => {
    const pdfDoc = await PDFDocument.create();
    await Promise.all(story.map((page: PageData) => addPagesToPdf(pdfDoc, page)));
    openPdf(pdfDoc);
    // savePdf(pdfDoc)
  };

  const addPagesToPdf = async (pdfDoc: PDFDocument, pageData: PageData) => {
    const page = pdfDoc.addPage([500, 500]);
    console.log('PAGE DATA ====>', pageData)
    const imageUrl = pageData.data.imageChoices;

    const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());
    const embeddedImage = await pdfDoc.embedPng(imageBytes);

    const imageWidth = page.getWidth();
    const imageHeight = page.getHeight();

    const imagePositionX = 0;
    const imagePositionY = 0;

    page.drawImage(embeddedImage, {
      x: imagePositionX,
      y: imagePositionY,
      width: imageWidth,
      height: imageHeight,
    });

    const text = pageData.data.page;

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    // const fontSize = 24;
    // const textColor = rgb(1, 1, 1);
    // const font = await pdfDoc.embedFont(fontType);
    const fontSize = fontSizeSize;
    // const textColor = fontColor;
    // Assuming fontColor is a string in the format 'rgb(r, g, b)'
  // Split the fontColor prop into an array
  const rgbValues = fontColor.split(',').map(Number);
  // Convert each value to a number from 0 to 1 and create a color
  const textColor = rgb(rgbValues[0] / 255, rgbValues[1] / 255, rgbValues[2] / 255);



    const textPositionX = 50;
    const textPositionY = 100;

    const options = {
      x: textPositionX,
      y: textPositionY,
      size: fontSize,
      font: font,
      color: textColor,
      opacity: 1,
      maxWidth: page.getWidth() - 100,
      align: 'center',
      wrap: true,
    };

    page.drawText(text, options);
  };

  const openPdf = async (pdfDoc: PDFDocument) => {
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  };

  const savePdf = async (pdfDoc: PDFDocument) => {
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  

    const fileRef = ref(storage, 'pdfs/myGeneratedPDF.pdf');
  
    // Convert blob to file (because firebase storage deals with File and not Blob)
    const file = new File([blob], 'myGeneratedPDF.pdf');
  
    const snapshot = await uploadBytes(fileRef, file);

       // Get download URL
  const url = await getDownloadURL(snapshot.ref);

  // Save the URL to your Firebase database
//   const docRef = doc(db, "users", session!.user "myGeneratedPDF");
//   const docRef = collection(db, "users", session?.user?.email!, 'characters' ), {
//   await updateDoc(docRef, { url });

  const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, );
  const updatedPage = await updateDoc(docRef, {
    pdf: url
  });

  console.log('Uploaded a blob or file!', snapshot);
    }
  

  const goToGelatoStore = () => {
    router.push('/gelatoProductsCatalog');
  };

  return (
    <div className="w-full bg-gray-50 h-1/6 text-center flex gap-6">
      <button
        className="p-4 rounded-lg bg-purple-500 text-white text-center my-6 hover:shadow-xl hover:bg-purple-600"
        onClick={createBookPDF}>
        Create PDF
      </button>

      <button
        className="p-4 rounded-lg bg-purple-500 text-white text-center my-6 hover:shadow-xl hover:bg-purple-600"
        onClick={goToGelatoStore}>
        Add products
      </button>

    
    </div>
  );
};

export default CreatePDF;
