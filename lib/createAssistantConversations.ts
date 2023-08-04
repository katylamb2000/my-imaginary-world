import openai from './chatgpt'

const assistantConversation = async (userMessage: any) => {
  console.log("Message PASSED", userMessage)

  try {
    const res = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: userMessage,
    //   messages: userMessage,
    //   temperature: 0.9,
    //   top_p: 1,
    //   max_tokens: 1800,
    //   frequency_penalty: 0,
    //   presence_penalty: 0,
    });

    console.log("RESPONSE FROM GPT API:", res.data.choices[0]);
    const answer = res.data.choices[0].message?.content
    return answer;
  } catch (err) {
    // console.error(`Error occurred while generating conversation: ${err}`);
    console.error(`Error occurred while generating conversation: ${err}`);

    return null;  // Or handle the error as appropriate for your application
  }
};
export default assistantConversation


