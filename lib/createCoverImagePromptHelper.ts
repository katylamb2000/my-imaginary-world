

import openai from './chatgpt'

const createCoverImagePromptHelper = async (prompt: string) => {
  const res = await openai
    .createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.9,
      top_p: 1,
      max_tokens: 300,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    .then((res) => {
      console.log(res)
      const coverImagePrompt = res.data.choices[0].text;

      if (!coverImagePrompt) {
        throw new Error("Story is undefined");
      }
      return {  coverImagePrompt };
    })
    .catch((err) => ({ message: `Error occurred while generating story: ${err.message}` }));  

  return res;
};

export default createCoverImagePromptHelper;



