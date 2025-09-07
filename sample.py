import markdown

md_text = """
# Hello

This is **bold** and this is a [link](https://example.com).

"""

html = markdown.markdown(md_text, extensions=['extra', 'codehilite', 'toc'])

print(html)