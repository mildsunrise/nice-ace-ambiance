> This is a member of the [nice-ace](https://github.com/jmendeth/nice-ace) collection.
> License, other themes and common facts are listed there.

# Ambiance

<!--**[Click here](http://TODO) to see a live demo or-->

**Read [How to Use](#how-to-use) below for how to launch a _demo server_,  
_use_ or _hack_ on this theme, it's super easy.**

Originally copied from [its CodeMirror equivalent](http://codemirror.net/demo/theme.html?ambiance), with improvements  
from @Gozala, @jmendeth, @danyaPostfactum and @nightwing,  
this theme features **bright**, **pastel** colors over a **dark** and slightly  
**noised** background.

It's best suited on a **minimalist** environment, with not-too-many controls.  
As a general rule, make sure to not have large editors: that can be stressing  
and avoids concentrating. We recommend to set a width of `printMargin + 20` cols.

<!-- TODO: screenshot -->

While very nice on its own, this can be used as a base for
other (nicer?) themes, as it happens on [Woodance](https://github.com/jmendeth/nice-ace-woodance).

## History

It was partially imported into Ace (see [ajaxorg/ace#936](https://github.com/ajaxorg/ace/pull/936)), but this version has several improvements:

 - No Mac-only font (uses the open-source [Ubuntu Mono](http://www.google.com/webfonts/specimen/Ubuntu%20Mono))
 - Has nice icons (via [Glyphicons](http://glyphicons.com))
 - Noisy background (missing in Ace)
 - Shadowed icons
 - Fixed folding arrows
 - A thin, bright cursor
 - Comprehensive editing via [Stylus](https://github.com/learnboost/stylus)
 - Other improvements and fixes

## How to use

The precompiled, ready-to-use files are on `dist/`.  
Just copy them to your scripts folder and you're fine.

```javascript
//you need to require 'lib/ace' for this to work (no builds)
editor.setTheme("ambiance");
```

This requires the [`image` plugin](https://raw.github.com/millermedeiros/requirejs-plugins/master/src/image.js),  
just place it at the scripts folder, along with the other plugins.

### Editing the theme

You should edit the source files at `src/`.  
Now to recompile the theme, just run:

```bash
./compile
```

It'll print detailed messages if something fails to compile.  
**Note:** you must have Node and NPM installed.

### Sample Server

You can also launch a webserver to try the theme:

```bash
./demo
```

It'll print the URL you have to browse.

## Why *Ubuntu Mono*?

 - The shapes are a bit more rounded and look better than Menlo or Monaco.
 - It's not Mac-specific (no platform discrimination).
 - Ambiance is open-source, the font should also be.
 - The hinting on bold text is better.

## Glyphicons legality?

Glyphicons Halflings (the originally used ones) aren't available  
for free, and (as any image icons) they present the inconvenient  
that they can't be easily shadowed.

So I've taken the normal Glyphicons set and vectorized them to a font.  
Then `@font-face`d that font and put a `text-shadow` for the effects.

If you think that I'm not fairly using Glyphicons, please post an issue.
