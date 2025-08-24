import requests

from app.config import settings

class UnsplashClient:
    BASE_URL = "https://api.unsplash.com"
    CLIENT_ID = settings.UNSPLASH_CLIENT_ID

    def __init__(self):
        self.headers = {
            "Accept-Version": "v1",
            "Authorization": f"Client-ID {UnsplashClient.CLIENT_ID}"
        }

    def search_photos(self, query, per_page=10, page=1):
        """Search photos by keyword"""
        response = self._get("/search/photos", {"query": query, "per_page": per_page, "page": page})

        results = response.get("results", [])

        photos = []
        for r in results:
            urls = r.get("urls", {})
            photos.append({
                "id": r.get("id"),
                "slug": r.get("slug"),
                "description": r.get("alt_description"),
                "raw": urls.get("raw", ""),
                "thumb": urls.get("thumb", ""),
                "regular": urls.get("regular", ""),
            })

        return photos


    def list_photos(self, page=1, per_page=10, order_by="latest"):
        """List photos"""
        return self._get("/photos", {"page": page, "per_page": per_page, "order_by": order_by})

    def get_photo(self, photo_id):
        """Get a photo by ID"""
        return self._get(f"/photos/{photo_id}")

    def get_random_photo(self, query=None, count=1):
        """Get a random photo (optionally by keyword)"""
        params = {"count": count}
        if query:
            params["query"] = query
        return self._get("/photos/random", params)

    def list_topics(self, page=1, per_page=10):
        """List all topics"""
        return self._get("/topics", {"page": page, "per_page": per_page})

    def get_topic(self, slug):
        """Get a topic by slug"""
        return self._get(f"/topics/{slug}")

    def search_collections(self, query, page=1, per_page=10):
        """Search for collections by keyword"""
        return self._get("/search/collections", {"query": query, "page": page, "per_page": per_page})

    def search_users(self, query, page=1, per_page=10):
        """Search for users by keyword"""
        return self._get("/search/users", {"query": query, "page": page, "per_page": per_page})

    def get_user(self, username):
        """Get a user's profile"""
        return self._get(f"/users/{username}")

    def get_user_photos(self, username, page=1, per_page=10):
        """Get photos uploaded by a user"""
        return self._get(f"/users/{username}/photos", {"page": page, "per_page": per_page})

    def _get(self, path, params=None):
        """Internal method for GET requests"""
        try:
            response = requests.get(f"{self.BASE_URL}{path}", headers=self.headers, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": str(e)}
