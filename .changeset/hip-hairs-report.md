---
"astro-page-insight": minor
---

## Change Cache File name rules to be more consistent with the URL path.

**This is a breaking change that your previous cache files will be invalid after this change. You need to clear the cache files and re-generate them after this change.**

`""`and `"/"` to `index.json`, `"/about/"`and `"/about"` to `about.json`, `"/what/about"` and `"/what/about/"` to `what-about.json`,  
`"/?query=string"` to `index-query=string.json`, `"/?query=string/"` to `index-query=string.json`,  
`"/about?query=string"` to `about-query=string.json`, `"/about/?query=string"` to `about-query=string.json`
