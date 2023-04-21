# import time
# import discord
# import os
# import os.path
# from discord.ext import commands
# from dotenv import load_dotenv
# import pyautogui as pg
# import sys
# import requests
# import asyncio
# from concurrent.futures import ThreadPoolExecutor
# from io import BytesIO
# import base64
# from typing import Dict, Any
# from requests.exceptions import HTTPError
# import firebase_admin
# from firebase_admin import credentials, firestore, storage
# import datetime
# import json
# import argparse

# # Load environment variables
# load_dotenv()

# # Set up Firebase credentials and app
# service_account_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.environ['FIREBASE_SERVICE_ACCOUNT_PATH'])
# cred = credentials.Certificate(service_account_path)
# if not firebase_admin._apps:
#     firebase_admin.initialize_app(cred, {
#         'storageBucket': os.environ['FIREBASE_STORAGE_BUCKET_NAME']
#     })

# # Get Firebase Storage bucket
# bucket = storage.bucket()

# # Get Discord token from environment variable
# discord_token = os.environ['DISCORD_BOT_TOKEN']

# # Set up argparse to get the storyId argument
# parser = argparse.ArgumentParser()
# parser.add_argument('--storyId', required=True, help='Story ID from Firestore')
# args = parser.parse_args()

# story_id = args.storyId

# # Fetch image prompts
# api_url = 'http://localhost:3000/api/getImagePrompts'
# response = requests.get(api_url, params={'storyId': story_id})
# prompts = response.json()

# prompt_counter = 0

# # Initialize Discord bot
# client = commands.Bot(command_prefix="*", intents=discord.Intents.all())

# # Event handler for bot connection
# @client.event
# async def on_ready():
#     print("Bot connected")
#     # print(prompts)

# async def upload_image_to_firebase_storage(attachment):
#     try:
#         response = requests.get(attachment.url, stream=True)
#         response.raise_for_status()

#         buffer = BytesIO()
#         for chunk in response.iter_content(chunk_size=8192):
#             buffer.write(chunk)
#         buffer.seek(0)

#         # Upload the image to Firebase Storage
#         loop = asyncio.get_event_loop()
#         with ThreadPoolExecutor() as executor:
#             await loop.run_in_executor(executor, lambda: bucket.blob(attachment.filename).upload_from_file(buffer, content_type=attachment.content_type))

#         # Generate a signed URL for the uploaded image
#         signed_url = bucket.blob(attachment.filename).generate_signed_url(datetime.timedelta(days=365 * 3), method='GET')

#         return signed_url
#     except HTTPError as http_err:
#         print(f'HTTP error occurred: {http_err}')
#     except Exception as err:
#         print(f'Other error occurred: {err}')
#     finally:
#         response.close()

# # Event handler for message handling
# @client.event
# async def on_message(message):
#     global prompt_counter

#     msg = message.content

#     if msg == 'start' and prompt_counter < len(prompts):
#         print(prompt_counter, len(prompts))
#         await asyncio.sleep(5)
#         pg.press('tab')
#         await asyncio.sleep(5)
#         pg.write('/imagine')
#         await asyncio.sleep(5)
#         pg.press('tab')
#         pg.write(prompts[prompt_counter])
#         await asyncio.sleep(3)
#         pg.press('enter')
#         await asyncio.sleep(3)
#         prompt_counter += 1

#     for attachment in message.attachments:
#         if prompt_counter < len(prompts):
#             await asyncio.sleep(5)
#             pg.write('/imagine')
#             await asyncio.sleep(5)
#             pg.press('tab')
#             pg.write(prompts[prompt_counter])
#             await asyncio.sleep(5)
#             pg.press('enter')
#             await asyncio.sleep(5)
#             prompt_counter += 1

#             # Save the attachment to a local file
#             with open(attachment.filename, "wb") as f:
#                 f.write(await attachment.read())

#             # Upload the local file to Firebase Storage
#             blob = bucket.blob(attachment.filename)
#             blob.upload_from_filename(attachment.filename)

#             # Generate a signed URL for the uploaded image
#             signed_url = blob.generate_signed_url(datetime.timedelta(days=365 * 3), method='GET')

#             # Remove the local file
#             os.remove(attachment.filename)

#             if prompts:
#                 # Save the signed URL to a JSON file
#                 url_data = {"url": signed_url}
#                 url_file_name = f"{attachment.filename}_url.json"
#                 with open(url_file_name, "w") as url_file:
#                     json.dump(url_data, url_file)

#                 # Upload the JSON file to Firebase Storage
#                 url_blob = bucket.blob(url_file_name)
#                 with open(url_file_name, "rb") as url_file:
#                     url_blob.upload_from_file(url_file, content_type="application/json")

#                 # Remove the local JSON file
#                 os.remove(url_file_name)

#                 await message.author.send(f"Image generated: {signed_url}")
#             else:
#                 await message.author.send("All image prompts have been completed!")

# client.run(discord_token)

import time
import discord
import os
import os.path
from discord.ext import commands
from dotenv import load_dotenv
import pyautogui as pg
import sys
import requests
import asyncio
import json
import argparse

# Load environment variables
load_dotenv()

# Get Discord token from environment variable
discord_token = os.environ['DISCORD_BOT_TOKEN']

# Set up argparse to get the storyId argument
# parser = argparse.ArgumentParser()
# parser.add_argument('--storyId', required=True, help='Story ID from Firestore')
# args = parser.parse_args()

# story_id = args.storyId

# Fetch image prompts
api_url = 'http://localhost:3000/api/getImagePrompts'
response = requests.get(api_url, params={'storyId': 'FAovAmLeipkW6w2icVYZ'})
prompts = response.json()

prompt_counter = 0

# Initialize Discord bot
client = commands.Bot(command_prefix="*", intents=discord.Intents.all())

# Event handler for bot connection
@client.event
async def on_ready():
    print("Bot connected")

# Event handler for message handling
@client.event
async def on_message(message):
    global prompt_counter

    msg = message.content

    if msg == 'start' and prompt_counter < len(prompts):
        await asyncio.sleep(5)
        pg.press('tab')
        await asyncio.sleep(5)
        pg.write('/imagine')
        await asyncio.sleep(5)
        pg.press('tab')
        pg.write(prompts[prompt_counter])
        await asyncio.sleep(3)
        pg.press('enter')
        await asyncio.sleep(3)
        prompt_counter += 1

client.run(discord_token)

