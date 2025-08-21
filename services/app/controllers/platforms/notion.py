import requests
import json
import mistune
from datetime import datetime


class NotionController:

    def __init__(self, app):
        self.mysql_db = app.state.mysql_db
        self.mongo_db = app.state.mongo_db

    def getUserAccessToken(self, org_id):
        get_query = f"""
            SELECT * FROM blog_platforms WHERE
            `key` = 'notion'
            AND `status` = 'Connected'
            AND org_id = '{org_id}'
            ;
        """
        platform = self.mysql_db.fetch_all(get_query)

        if not platform:
            return None

        return platform[0]

    def markdown_to_notion_blocks(self, markdown_text):
        """
        Convert basic Markdown to Notion blocks.
        Supports: heading, paragraph, bold, italic, links.
        """
        parser = mistune.create_markdown(renderer=mistune.AstRenderer())
        tokens = parser(markdown_text)

        blocks = []

        for token in tokens:
            if token['type'] == 'heading':
                level = token['level']
                heading_type = f'heading_{min(level, 3)}'
                blocks.append({
                    "object": "block",
                    "type": heading_type,
                    heading_type: {
                        "rich_text": [
                            {
                                "type": "text",
                                "text": {"content": token['children'][0]['text']}
                            }
                        ]
                    }
                })

            elif token['type'] == 'paragraph':
                rich_texts = []
                for child in token.get('children', []):
                    if child['type'] == 'text':
                        rich_texts.append({
                            "type": "text",
                            "text": {"content": child['text']}
                        })
                    elif child['type'] == 'strong':
                        rich_texts.append({
                            "type": "text",
                            "text": {"content": child['children'][0]['text']},
                            "annotations": {"bold": True}
                        })
                    elif child['type'] == 'emphasis':
                        rich_texts.append({
                            "type": "text",
                            "text": {"content": child['children'][0]['text']},
                            "annotations": {"italic": True}
                        })
                    elif child['type'] == 'link':
                        rich_texts.append({
                            "type": "text",
                            "text": {
                                "content": child['children'][0]['text'],
                                "link": child['link']
                            }
                        })

                blocks.append({
                    "object": "block",
                    "type": "paragraph",
                    "paragraph": {"rich_text": rich_texts}
                })

        return blocks

    def post(self, platform_details, data):
        try:
            title = data['title']
            markdown_content = data['content']

            auth_token = platform_details.get("oauth_token")
            user_preference = json.loads(platform_details.get("user_preference", "{}"))
            database = user_preference.get("database", {"id": "", "url": ""})

            database_id = database.get("id")
            post_status = user_preference.get("post_status", "published")

            if not database_id:
                return {
                    "success": False,
                    "message": "Invalid Database Id, Please check!"
                }

            headers = {
                "Authorization": f"Bearer {auth_token}",
                "Content-Type": "application/json",
                "Notion-Version": "2022-06-28"
            }

            post_url = "https://api.notion.com/v1/pages"

            # Convert markdown to Notion blocks
            children_blocks = self.markdown_to_notion_blocks(markdown_content)

            post_data = {
                "parent": {
                    "database_id": database_id
                },
                "properties": {
                    "Name": {
                        "title": [
                            {
                                "type": "text",
                                "text": {
                                    "content": title
                                }
                            }
                        ]
                    },
                    "Status": {
                        "select": {
                            "name": post_status.capitalize()
                        }
                    },
                    "Created at": {
                        "date": {
                            "start": datetime.utcnow().isoformat()
                        }
                    }
                },
                "children": children_blocks
            }

            response = requests.post(post_url, headers=headers, json=post_data)

            if response.status_code in [200, 201]:
                return {
                    "success": True,
                    "message": "Notion blog post created successfully.",
                    "data": response.json()
                }
            else:
                return {
                    "success": False,
                    "message": response.text,
                }

        except Exception as e:
            return {"success": False, "message": f"Error posting to Notion: {str(e)}"}

    def create_post(self, org_id, data):
        try:
            platform_details = self.getUserAccessToken(org_id)

            if not platform_details:
                return {"success": False, "message": 'Failed to get platform details, Please check!'}

            return self.post(platform_details, data)

        except Exception as e:
            print('Error in Notion blog posting', str(e))
            return {"success": False, "message": f'Error in Notion blog posting, {str(e)}'}
