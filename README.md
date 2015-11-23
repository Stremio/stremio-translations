# stremio-translations

**This is the repository the [Stremio media center](http://www.strem.io) uses for all translation strings.**

Any help with contributing additional translations would be extremely helpful! For contributing, use en_US as a starting point because it's always guaranteed to include all the translation strings. Thank you!

Top priority translations:

* ~~pt-BR~~ - thanks to luanhssa
* pt-PT
* fr-FR


**The ability to use those translations will be out in Stremio 3.4.0, scheduled to come out by 24.11.2015**


How to test in the app
====================
Clone this repo, copy en-US.json as a starting point into your language's locale file, following IETF. To test in the app, start Stremio like:
```
# for windows
%LOCALAPPDATA%\Programs\LNV\Stremio\Stremio.exe . --translation=PATH_TO_JSON

# for mac
/Applications/Stremio.app/Contents/MacOS/Electron . --translation=PATH_TO_JSON
```
