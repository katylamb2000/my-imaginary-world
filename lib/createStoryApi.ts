

// import openai from './chatgpt'

// const query = async (prompt: string) => {
//   const res = await openai
//     .createCompletion({
//       model: "text-davinci-003",
//       prompt: prompt,
//       temperature: 0.9,
//       top_p: 1,
//       max_tokens: 500,
//       frequency_penalty: 0,
//       presence_penalty: 0,
//     })
//     .then((res) => {
//       const story = res.data.choices[0].text;
//       if (!story) {
//         throw new Error("Story is undefined");
//       }
//       const lines = story.split("\n"); // Split the story into lines
//       console.log(lines)
//       // Remove lines starting with "Page X:"
//       const filteredLines = lines.filter((line) => !line.startsWith("Page "));
//       console.log(filteredLines)
//       // Group lines into pages
//       const pages: string[] = [];
//       let currentPage = "";
//       filteredLines.forEach((line) => {
//         if (line.startsWith("Title: ")) {
//           pages.push(line);
//         } else {
//           currentPage += line + "\n";
//           if (line.trim() === "") {
//             pages.push(currentPage.trim());
//             console.log(pages)
//             currentPage = "";
//           }
//         }
//       });
  
//       const title = pages[0].trim(); // Use the first line as the title
//       // Remove the title from the pages array
//       const pagesWithoutTitle = pages.slice(1);
  
//       return { title, pages: pagesWithoutTitle, story };
//     })
//     .catch((err) => ({ message: `Error occurred while generating story: ${err.message}` }));  

//   return res;
// };

// export default query;


// import openai from './chatgpt'

// const query = async (prompt: string) => {
//   console.log("PROMPT PASSED", prompt)
//   const res = await openai
//     .createCompletion({
//       model: "text-davinci-003",
//       prompt: prompt,
//       temperature: 0.9,
//       top_p: 1,
//       max_tokens: 1800,
//       frequency_penalty: 0,
//       presence_penalty: 0,
//     })
//     .then((res) => {
//       console.log("RESPONSE FROM GPT API:", res);

//       const story = res.data.choices[0].text;
//       if (!story) {
//         throw new Error("Story is undefined");

//       }
//       if (story){
//       const lines = story.split("\n"); // Split the story into lines
      
//       const titleLine = lines.find((line) => line.startsWith("Title: "));
//       const title = titleLine?.split(": ")[1]; // Extract the title

//       // Filter lines containing actual page content (removing empty lines and title line)
//       const contentLines = lines.filter((line) => line.trim() !== "" && !line.startsWith("Title: "));

//       const pages: string[] = [];
//       let currentPage = "";

//       contentLines.forEach((line) => {
//         if (line.startsWith("Page ")) {
//           if (currentPage !== "") {
//             pages.push(currentPage.trim()); // Push the accumulated content as a page when a new page starts
//           }
//           currentPage = line.split(": ")[1]; // Start new page content, removing the 'Page X: ' part
//         } else {
//           currentPage += " " + line; // Continue accumulating content for the current page
//         }
//       });

//       if (currentPage !== "") {
//         pages.push(currentPage.trim()); // Push the last page content
//       }

//       return { title, pages, story };
//     }
//     })

//     .catch((err) => ({ message: `Error occurred while generating story: ${err.message}` }));  

//   return res;

// };

// export default query;

import openai from './chatgpt'

const query = async (prompt: string) => {
  console.log("PROMPT PASSED", prompt)

  try {
    const res = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.9,
      top_p: 1,
      max_tokens: 1800,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

  

    const story = res.data.choices[0].text;
    if (!story) {
      throw new Error("Story is undefined");
    }

    const lines = story.split("\n"); // Split the story into lines

    const titleLine = lines.find((line) => line.startsWith("Title: "));
    const title = titleLine?.split(": ")[1]; // Extract the title

    // Filter lines containing actual page content (removing empty lines and title line)
    const contentLines = lines.filter((line) => line.trim() !== "" && !line.startsWith("Title: "));

    const pages: string[] = [];
    let currentPage = "";

    contentLines.forEach((line) => {
      if (line.startsWith("Page ")) {
        if (currentPage !== "") {
          pages.push(currentPage.trim()); // Push the accumulated content as a page when a new page starts
        }
        currentPage = line.includes(":") ? line.split(": ")[1] : ""; // Start new page content, removing the 'Page X: ' part
      } else {
        currentPage += " " + line; // Continue accumulating content for the current page
      }
    });
    
    if (currentPage !== "") {
      pages.push(currentPage.trim()); // Push the last page content
    }
    
    return { success: true, data: { title, pages, story } };

  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error occurred while generating story: ${err.message}`);
      return { success: false, message: `Error occurred while generating story: ${err.message}` };
    } else {
      console.error(`Unexpected error occurred while generating story.`);
      return { success: false, message: `Unexpected error occurred while generating story.` };
    }
  }
  
};

export default query;
