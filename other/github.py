import os
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential

endpoint = "https://models.github.ai/inference"
model = "openai/gpt-4.1-mini"
token = "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"

client = ChatCompletionsClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(token),
)

response = client.complete(
    messages=[
        SystemMessage(""),
        UserMessage("Create me a stunning full-form article blog about Dropshipping"),
    ],
    temperature=1,
    top_p=1,
    model=model
)

print(response.choices[0].message.content)

