import openai from './chatgpt'

const storyBaseIP = async (prompt: string) => {
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
    
  
    return {  imagePrompt };
      })
      .catch(
        (err) =>
          `Oh GOSH the Story Wizard has writers block right now ! (Error: ${err.message} ${prompt})`
      );
  
    return res;
  };
  
  export default storyBaseIP;
  

    