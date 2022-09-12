Use Gold as primary resource, exists on all tiles to some degree (like food/prod in civ)
Every resource can be sold for gold, and gold can be used to purchace any resource (or unit?)
When u try to buy something but are short on resources, it will auto deduct gold (missing res in red, "+27GP")

spawn board with 1 town for each player on a hex, default area size
click on tiles to prompt interaction: "build road to here", "build town here -- 'requires 2 roads to get here... +2wood +2brick'", etc.
  if clicked tile is occupied by a city, bring up its menu
allow construction of buildings on tiles within your city! such as defense turret, barraks (auto creates knights to a certain cap, click to send out)


User actions happen INSTANTLY! push to db, then useEffect to render walking animations or w/e, but damage or w/e can be calculated instantly

resources: wood, stone, iron, food



Could probably convert tiles into an array of Classes with various functions
on update of rtdb, check which tiles actually need to update, then update tiles array which gets passed to stuff 

Merged drei for models?


Fog of war

Wraparound or sphere map?
Look at sampleA picture

-- MAYBE just ore, wood, food, gold ?

More goodies on the map, significantly increase cost of building / upgrading cities
Passive territory gain?


https://github.com/pmndrs/gltfjsx
Suspense fallback for GLTF models might help some loading issues?
- Instancing? Look at drei -> perfomance section
Also, just using fog of war / changing camera clipping would prob help a lot on bigger maps
