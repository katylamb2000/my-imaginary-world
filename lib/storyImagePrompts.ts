import openai from './chatgpt'

const imageQuery = async (prompt: string) => {
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

    console.log("RESPONSE FROM GPT IMage Idea API:", res);

    const imageDescriptions = res.data.choices[0].text;
    if (!imageDescriptions) {
      throw new Error("Story is undefined");
    }

    const lines = imageDescriptions.split("\n"); // Split the story into lines

    const style = lines.find((line) => line.startsWith("Overall style"));
    const generalStyle = style?.split(": ")[1]; // Extract the title

    // Filter lines containing actual page content (removing empty lines and title line)
    const pageImages = lines.filter((line) => line.trim() !== "" && !line.startsWith("Overall style"));

    const pages: string[] = [];
    let currentPage = "";

    pageImages.forEach((line) => {
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
    

    return { success: true, data: { generalStyle, pages } };

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

export default imageQuery;
