 import openai from './chatgpt';

 interface PageDetail {
  page?: string;
  backgroundImage?: string;
  characterCloseUp?: string;
  object?: string;
  wildCardImage?: string;
  [key: string]: string | undefined;
}

const imageQuery = async (prompt: string) => {
  console.log("PROMPT PASSED", prompt);

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

    const imageDescriptions = res.data.choices[0].text;
   
    if (!imageDescriptions) {
      throw new Error("Story is undefined");
    }

    const pages = imageDescriptions.split("\n"); // Split the story into lines



    return { success: true, data: { pages } };

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
