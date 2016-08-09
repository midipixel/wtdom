# Warlock's Tower - DOM Prototype
This prototype was developed as a proof of concept for the CSS Conf AR 2016 talk "(Game Dev for Web Designers: Play with the DOM like never before)[http://midipixel.com/palestras/domgamedev]".
It implements the basic mechanic of the PC Game "Warlock's Tower", by Midipixel, by using HTML, CSS and JS. No canvas, no WebGL. Just good ol' DOM.

##How to play
The game's mechanic is straightforward. Each step you take costs one life. Lose all lives, and you're dead! You must use the gems to restore your life and reach the exit.
In this prototype, you must use the level loader at the top to play new levels. You will, however, need a local server for that. You can try the Conf's Prototype [here](http://midipixel.com/wtdom/).
[Check out the official game](http://midipixel.com/warlockstower) for lots of levels!

##Creating new levels
To create a level, just replicate one of the html files in the levels folder. Every level is a HTML file. Rows and cols are creating by using tables, while events are created by adding the following classes to the <td> elements:
* gem3 - A gem that restores 3 lives
* gem5 - A gem that restores 5 lives
* hole - An obstacle. Tim cannot move in its direction
* start - Tim's starting position
* exit - Well, the level's exit


