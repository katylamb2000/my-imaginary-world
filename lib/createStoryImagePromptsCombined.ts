import openai from './chatgpt'

const imagePromptCreator = async (imagesPrompt: string) => {
  console.log("Starting imagePromptCreator function", imagesPrompt);  // Add a log at the start of the function
  
  const res = await openai
    .createCompletion({
      model: "text-davinci-003",
      prompt: imagesPrompt,
      temperature: 0.9,
      top_p: 1,
      max_tokens: 500,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    .then((res) => {
      console.log("Received response from OpenAI", res);  // Add a log after receiving the response
      
      const story = res.data.choices[0].text;
      if (!story) {
        throw new Error("Story is undefined");
      }

      console.log("Story:", story);  // Add a log to check the story
      
      const lines = story.split("\n"); // Split the story into lines

      // Remove lines starting with "Page X:"
      const filteredLines = lines.filter((line) => !line.startsWith("Page "));
      
      console.log("Filtered lines:", filteredLines);  // Add a log to check the filtered lines
      
      // Group lines into pages
      const pages: string[] = [];
      let currentPage = "";
      filteredLines.forEach((line) => {
        if (line.startsWith("Title: ")) {
          pages.push(line);
        } else {
          currentPage += line + "\n";
          if (line.trim() === "") {
            pages.push(currentPage.trim());
            currentPage = "";
          }
        }
      });
      
      console.log("Pages:", pages);  // Add a log to check the pages
      
      const title = pages[0].trim(); // Use the first line as the title

      // Remove the title from the pages array
      const pagesWithoutTitle = pages.slice(1);
      
      console.log("Pages without title:", pagesWithoutTitle);  // Add a log to check the pages without title
      
      return { title, pagesImagesPrompts: pagesWithoutTitle, story };
    })
    .catch((err) => {
      console.error("Error in imagePromptCreator function:", err);  // Add a log to check for errors
      return { message: `Oh GOSH the Story Wizard has writers block right now ! (Error: ${err.message} ${prompt})` }
    });
    
  console.log("Ending imagePromptCreator function");  // Add a log at the end of the function
  
  return res;
};

export default imagePromptCreator;


  
