BlebbeJS
========

A simple moodboard generator.
```javascript
blebbe(id_element, min_size, max_size, distribution);
```

#### Attributes
+ `id_element` id of the div that will contain the moodboard
+ `min_size` minimum width of tiles
+ `max_size` maximum width of tiles
+ `distribution` array with 3 inputs : [small_tiles , medium_tiles, big_tiles]. These are the proportions for each size. E.g. [1,1,2] means that the number of big tiles is double that of medium tiles, and small ones, on average. If you want only one size you can write : [0,0,1].

That's it, enjoy!
