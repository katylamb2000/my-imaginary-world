import openai from './chatgpt'

const query = async (prompt: string, model: string) => {
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
        const story = res.data.choices[0].text;
        if (!story) {
          throw new Error("Story is undefined");
        }
        const lines = story.split("\n"); // Split the story into lines
  
        // Remove lines starting with "Page X:"
        const filteredLines = lines.filter((line) => !line.startsWith("Page "));
  
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
  
        const title = pages[0].trim(); // Use the first line as the title
  
        // Remove the title from the pages array
        const pagesWithoutTitle = pages.slice(1);
  
        return { title, pages: pagesWithoutTitle, story };
      })
      .catch((err) => ({ message: `Oh GOSH the Story Wizard has writers block right now ! (Error: ${err.message} ${prompt})` }));  
    return res;
  };
  
  export default query;
  
