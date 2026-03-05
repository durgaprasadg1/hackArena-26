import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function generateHealthSummary(data) {

  const prompt = `
User Data

Calories Intake: ${data.intake}
Calories Burned: ${data.burn}
Sleep: ${data.sleep}
Water Intake: ${data.water}

Give improvement suggestions.
`;

  const response = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [{ role: "user", content: prompt }]
  });

  return response.choices[0].message.content;
}