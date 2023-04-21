import openai from './chatgpt'

const imagePromtQuery = async (prompt: string) => {
    const res = await openai
      .createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.9,
        top_p: 1,
        max_tokens: 500,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
      .then((res) => {
        const imagePrompt = res.data.choices[0].text;
      // const lines = imagePrompts.split("\n"); // Split the story into lines
  
      //   // Remove lines starting with "Page X:"
      //   const filteredLines = lines.filter((line) => !line.startsWith("Page "));
  
      //   // Group lines into pages
      //   const pages = [];
      //   let currentPage = "";
      //   filteredLines.forEach((line) => {
      //     if (line.startsWith("Title: ")) {
      //       pages.push(line);
      //     } else {
      //       currentPage += line + "\n";
      //       if (line.trim() === "") {
      //         pages.push(currentPage.trim());
      //         currentPage = "";
      //       }
      //     }
      //   });
  
      //   const title = pages[0].trim(); // Use the first line as the title
  
      //   // Remove the title from the pages array
      //   const pagesWithoutTitle = pages.slice(1);
  
        // return { title, pages: pagesWithoutTitle, imagePrompts };
        return {  imagePrompt };
      })
      .catch(
        (err) =>
          `Oh GOSH the Story Wizard has writers block right now ! (Error: ${err.message} ${prompt})`
      );
  
    return res;
  };
  
  export default imagePromtQuery;
  

    