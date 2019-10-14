# Example
```json
{
  "content": "Example!",
  "embed": {
    "color": 0xB54747,
    "title": "This is an example embed",
    "description": "This is an example embed description",
    "author": {
      "name": "Example User",
      "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
      "url": "https://conquestsim.io"
    },
    "image": {
      "url": "https://cdn.discordapp.com/embed/avatars/0.png"
    },
    "thumbnail": {
      "url": "https://cdn.discordapp.com/embed/avatars/0.png"
    },
    "fields": [ {
        "name": "This is an example field",
        "value": "Hi There!"
      } ],
    "footer": {
      "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
      "text": "footer text"
    },
  }
}
```
## Placeholders

`[AuthorIconURL]`: Will be replaced with the Authors Icon URL.
 ```json
 "image": {
   "url": "[AuthorIconURL]"
 }
 ```
`[AuthorName]`: Will be replaced with the Authors Name.
 ```json
 "title": "[AuthorName]"
 ```

 `[AuthorID]`: Will be replaced with the Authors ID.
 ```json
 "title": "[AuthorName] ([AuthorID])"
 ```