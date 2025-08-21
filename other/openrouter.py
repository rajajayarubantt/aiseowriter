from openai import OpenAI

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="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",
)

completion = client.chat.completions.create(
  
  model="openai/gpt-4o",
  messages=[
    {
      "role": "user",
      "content": "What is the meaning of life?"
    }
  ],
   max_tokens=1000,
)

print(completion.choices[0].message.content)
