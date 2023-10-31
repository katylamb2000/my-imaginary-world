// import type { NextApiRequest, NextApiResponse } from "next";
// import imageQuery from "../../lib/storyImagePrompts";
// import admin from "firebase-admin";
// import { adminDb } from "../../firebaseAdmin";

// interface PageDetail {
//     page?: string;
//     backgroundImage?: string;
//     characterCloseUp?: string;
//     object?: string;
//     wildCardImage?: string;
//     [key: string]: string | undefined;
//   }

//   type PromptType = {
//     firstImagePromptIdea?: string;
//     smallImagePromptIdea?: string;
//     [key: string]: string | undefined;
// };

  
//   function combineImageDescriptions(pages: string[]): string[] {
//     return pages.map(page => {
//       const details: PageDetail = {};
//       const lines = page.split(','); // Assuming individual descriptors are comma-separated
  
//       lines.forEach(line => {
//         // if (line.includes('backgroundImage')) details.backgroundImage = line.split(':')[1].trim();
//         if (line.includes('1 character:')) details.characterCloseUp = line.split(':')[1].trim();
//         if (line.includes('2 object:')) details.object = line.split(':')[1].trim();
//         if (line.includes('3 wild:')) details.wildCardImage = line.split(':')[1].trim();
//       });
  
//       // Combine the individual descriptions into a single string for the smallImageIdeas prompt type
//       console.log('this is details which should include the small images', details)
//       return `characterCloseUp: ${details.characterCloseUp}, object: ${details.object}, wildCardImage: ${details.wildCardImage}`;
//     });
//   }
  

// export default async function createStoryImagePrompts(
//     req: NextApiRequest,
//     res: NextApiResponse<{ answer: { message: string }; data?: { pages: any }; }>

// ) {
//     const { session, prompt, storyId, promptType } = req.body;

//     if (!prompt || !session) {
//         res.status(400).json({ answer: { message: !prompt ? 'I dont have a prompt' : 'I dont have a session' } });
//         return;
//     }

//     try {
//        // ...
// const response = await imageQuery(prompt, promptType);
// let pagesArray = response.data?.pages?.filter(page => page !== '') || [];

// if (promptType === 'smallImageIdeas') {
//   pagesArray = combineImageDescriptions(pagesArray);
// }

//   // Instead of mapping into separate image prompts, consolidate them under one object for each page
//   const consolidatedPrompts: PageDetail[] = pagesArray.map(page => {
//     const [_, number, ...rest] = page.split(' ');
//     const details = rest.join(' ').trim();

//     const prompt: PageDetail = {};
//     if (promptType === 'firstImageIdeas') {
//       prompt.firstImagePromptIdea = details;
//     } else if (promptType === 'smallImageIdeas') {
//       const lines = details.split(',');
//       lines.forEach(line => {
//         if (line.includes('backgroundImage')) prompt.backgroundImage = line.split(':')[1].trim();
//         if (line.includes('characterCloseUp')) prompt.characterCloseUp = line.split(':')[1].trim();
//         if (line.includes('object')) prompt.object = line.split(':')[1].trim();
//         if (line.includes('wildCardImage')) prompt.wildCardImage = line.split(':')[1].trim();
//       });
//     }

//     return prompt;
//   });

//   function parseImageIdeas(ideas: string[]): PageDetail[] {
//     const parsedIdeas: PageDetail[] = [];
    
//     for (let i = 0; i < ideas.length; i++) {
//         if (ideas[i].startsWith("Page")) {
//             const details: PageDetail = {};
//             while (!ideas[i + 1].startsWith("Page") && i + 1 < ideas.length) {
//                 i++; // move to next line
//                 if (ideas[i].includes('"1 character":')) details.characterCloseUp = ideas[i].split(':')[1].trim().replace(/"/g, '');
//                 if (ideas[i].includes('"2 object":')) details.object = ideas[i].split(':')[1].trim().replace(/"/g, '');
//                 if (ideas[i].includes('"3 wild":')) details.wildCardImage = ideas[i].split(':')[1].trim().replace(/"/g, '');
//             }
//             parsedIdeas.push(details);
//         }
//     }
//     return parsedIdeas;
// }

// const structuredData = parseImageIdeas(smallImageIdeas);
// console.log(structuredData);


 

//         const batch = adminDb.batch();

//         for (let index = 0; index < consolidatedPrompts.length; index++) {
//             const prompt = consolidatedPrompts[index];
      
//             const pageRef = adminDb
//                 .collection('users')
//                 .doc(session.user.email)
//                 .collection('storys')
//                 .doc(storyId)
//                 .collection('storyContent')
//                 .doc(`page_${index + 1}`);
      
//             // We'll always update the existing page document with the new consolidated image prompts
//             batch.update(pageRef, prompt);
//           }

//         await batch.commit();
//         res.status(200).json({ answer: { message: "Data successfully saved." } , data: {pages: pagesArray}});
//     } catch (error) {
//         res.status(500).json({ answer: { message: "Internal Server Error." } });
//     }
// }

// import type { NextApiRequest, NextApiResponse } from "next";
// import imageQuery from "../../lib/storyImagePrompts";
// import admin from "firebase-admin";
// import { adminDb } from "../../firebaseAdmin";

// interface PageDetail {
//     page?: string;
//     backgroundImage?: string;
//     characterCloseUp?: string;
//     object?: string;
//     wildCardImage?: string;
//     [key: string]: string | undefined;
// }

// function combineImageDescriptions(pages: string[]): PageDetail[] {
//     const consolidatedDetails: PageDetail[] = [];

//     let isInsideBlock = false; // A flag to detect if we're inside a page block
//     let details: PageDetail = {};

//     pages.forEach(line => {
//         console.log('LINE', line);
//         if (line.includes('{')) {
//             isInsideBlock = true; // Start of a page block
//             details = {}; // Reset the details object for a new page
//         } else if (line.includes('}')) {
//             isInsideBlock = false; // End of a page block
//             consolidatedDetails.push(details); // Add the gathered details to the final list
//         } else if (isInsideBlock) {
//             if (line.includes('"1 character":')) details.characterCloseUp = line.split('":')[1].trim().replace(/"/g, '');
//             if (line.includes('"2 object":')) details.object = line.split('":')[1].trim().replace(/"/g, '');
//             if (line.includes('"3 wild":')) details.wildCardImage = line.split('":')[1].trim().replace(/"/g, '');
//         }
//     });
    
//     console.log("Processed details:", consolidatedDetails);
    
//     return consolidatedDetails.filter(detail => Object.keys(detail).length); // Filter out any empty page details
// }



// export default async function createStoryImagePrompts(
//     req: NextApiRequest,
//     res: NextApiResponse<{ answer: { message: string }; data?: { pages: any }; }>
// ) {
//     const { session, prompt, storyId, promptType } = req.body;

//     if (!prompt || !session) {
//         res.status(400).json({ answer: { message: !prompt ? 'I dont have a prompt' : 'I dont have a session' } });
//         return;
//     }

//     try {
//         const response = await imageQuery(prompt, promptType);
//         let pagesArray = response.data?.pages?.filter(page => page !== '') || [];

//         let consolidatedPrompts: PageDetail[];
//         if (promptType === 'smallImageIdeas') {
//             consolidatedPrompts = combineImageDescriptions(pagesArray);
//         } else {
//             // Handle the 'firstImageIdeas' case or any other promptTypes you have

//             consolidatedPrompts = pagesArray.map((page) => {
//                 const [_, number, ...rest] = page.split(' ');
//                 const details = rest.join(' ').trim();
            
//                 const prompt: PageDetail = {};
//                 if (promptType === 'firstImageIdeas') {
//                   prompt.firstImagePromptIdea = details;
//                 } else if (promptType === 'smallImageIdeas') {
//                   const lines = details.split(',');
//                   lines.forEach(line => {
//                     if (line.includes('backgroundImage')) prompt.backgroundImage = line.split(':')[1].trim();
//                     if (line.includes('characterCloseUp')) prompt.characterCloseUp = line.split(':')[1].trim();
//                     if (line.includes('object')) prompt.object = line.split(':')[1].trim();
//                     if (line.includes('wildCardImage')) prompt.wildCardImage = line.split(':')[1].trim();
//                   });
//                 }
//                 return prompt;
//             });
            
//      }
//         console.log('consolodated prompt ==>>', promptType, consolidatedPrompts)
//         const batch = adminDb.batch();

//         for (let index = 0; index < consolidatedPrompts.length; index++) {
//             const prompt = consolidatedPrompts[index];
      
//             const pageRef = adminDb
//                 .collection('users')
//                 .doc(session.user.email)
//                 .collection('storys')
//                 .doc(storyId)
//                 .collection('storyContent')
//                 .doc(`page_${index + 1}`);

//             batch.update(pageRef, prompt); // Update existing pages
//         }

//         await batch.commit();
//         res.status(200).json({ answer: { message: "Data successfully saved." }, data: { pages: pagesArray } });
//     } catch (error) {
//         res.status(500).json({ answer: { message: "Internal Server Error." } });
//     }
// }

import type { NextApiRequest, NextApiResponse } from "next";
import imageQuery from "../../lib/storyImagePrompts";
import admin from "firebase-admin";
import { adminDb } from "../../firebaseAdmin";

interface PageDetail {
    page?: string;
    backgroundImage?: string;
    characterCloseUp?: string;
    object?: string;
    wildCardImage?: string;
    firstImagePromptIdea?: string;
    [key: string]: string | undefined;
}

function combineImageDescriptions(pages: string[]): PageDetail[] {
    const consolidatedDetails: PageDetail[] = [];

    let isInsideBlock = false; // A flag to detect if we're inside a page block
    let details: PageDetail = {};

    pages.forEach(line => {
        if (line.includes('{')) {
            isInsideBlock = true; // Start of a page block
            details = {}; // Reset the details object for a new page
        } else if (line.includes('}')) {
            isInsideBlock = false; // End of a page block
            consolidatedDetails.push(details); // Add the gathered details to the final list
        } else if (isInsideBlock) {
            if (line.includes('"1 character":')) details.characterCloseUp = line.split('":')[1].trim().replace(/"/g, '');
            if (line.includes('"2 object":')) details.object = line.split('":')[1].trim().replace(/"/g, '');
            if (line.includes('"3 wild":')) details.wildCardImage = line.split('":')[1].trim().replace(/"/g, '');
        }
    });

    return consolidatedDetails.filter(detail => Object.keys(detail).length); // Filter out any empty page details
}


export default async function createStoryImagePrompts(
    req: NextApiRequest,
    res: NextApiResponse<{ answer: { message: string }; data?: { pages: any }; }>
) {
    const { session, prompt, storyId, promptType, pageId } = req.body;

    if (!prompt || !session) {
        res.status(400).json({ answer: { message: !prompt ? 'I dont have a prompt' : 'I dont have a session' } });
        return;
    }

    try {
        const response = await imageQuery(prompt, promptType);
        const pagesArray = response.data?.pages?.filter(page => page !== '') || [];

        let consolidatedPrompts: PageDetail[];
        if (promptType === 'smallImageIdeas') {
            consolidatedPrompts = combineImageDescriptions(pagesArray);
        } else {
            consolidatedPrompts = pagesArray.map((page) => {
                const prompt: PageDetail = {};
                const match = page.match(/^Page_\d+: (.+)$/);
                if (match) {
                    prompt.firstImagePromptIdea = match[1];
                }
                return prompt;
            }).filter(detail => Object.keys(detail).length);
        }

        const batch = adminDb.batch();
        for (let index = 0; index < consolidatedPrompts.length; index++) {
            const prompt = consolidatedPrompts[index];
            const pageRef = adminDb
                .collection('users')
                .doc(session.user.email)
                .collection('storys')
                .doc(storyId)
                .collection('storyContent')
                .doc(`page_${index + 1}`);
            batch.update(pageRef, prompt);
        }
   // Save the entire pagesArray as a backup in case of parsing issues for 'smallImageIdeas'
   if (promptType === 'smallImageIdeas') {
    const backupRef = adminDb
        .collection('users')
        .doc(session.user.email)
        .collection('storys')
        .doc(storyId)
        .collection('small images')
        .doc('backup');

    batch.set(backupRef, { prompts: pagesArray });
}

   // Save the entire pagesArray as a backup in case of parsing issues for 'smallImageIdeas'
   if (promptType === 'firstImageIdea' && pagesArray.length) {
    console.error("image prompt idea", pagesArray);
    console.error("WHERE IS IT", pagesArray, session, storyId, pageId);
    const pageRef = adminDb
        .collection('users')
        .doc(session.user.email)
        .collection('storys')
        .doc(storyId)
        .collection('storyContent')
        .doc(pageId);

        const promptText = pagesArray[0].replace(/^Illustration Prompt for Page \d+: /, '').trim();
        console.log("PROMPT TEXT", promptText, "page id =========>>>", pageId)

        try {
            await pageRef.set({ firstImagePromptIdea: pagesArray[0] }, { merge: true });
   
        } catch (error) {
            console.error("Error updating/creating Firestore document:", error);
        }
        
}

        await batch.commit();
        res.status(200).json({ answer: { message: "Data successfully saved." }, data: { pages: pagesArray } });
    } catch (error) {
        res.status(500).json({ answer: { message: "Internal Server Error." } });
    }
}
