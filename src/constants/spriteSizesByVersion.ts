// Sizes are in pixels and are width and height of the sprite

// For the PokemonCardBox (the pokemon[id] page)
const LARGE = 180;
const MEDIUM = 150;
const SMALL = 100;
const TINY = 50;

// For the autocomplete option sprites
const OPTION_LARGE = 100;
const OPTION_MEDIUM = 75;
const OPTION_SMALL = 50;

export const spriteSizesByVersion: Record<string, number> = {
  "red-blue": LARGE,
  yellow: LARGE,
  "gold-silver": LARGE,
  crystal: LARGE,
  "ruby-sapphire": SMALL,
  emerald: SMALL,
  "firered-leafgreen": SMALL,
  "diamond-pearl": MEDIUM,
  platinum: MEDIUM,
  "heartgold-soulsilver": MEDIUM,
  "black-white": MEDIUM,
  colosseum: MEDIUM,
  xd: MEDIUM,
  "black-2-white-2": MEDIUM,
  "x-y": TINY,
  "omega-ruby-alpha-sapphire": LARGE,
  "sun-moon": MEDIUM,
  "ultra-sun-ultra-moon": MEDIUM,
  "lets-go-pikachu-lets-go-eevee": LARGE,
  "sword-shield": MEDIUM,
  "the-isle-of-armor": MEDIUM,
  "the-crown-tundra": MEDIUM,
  "brilliant-diamond-and-shining-pearl": MEDIUM,
  "legends-arceus": MEDIUM,
  "scarlet-violet": MEDIUM,
};

export const optionSpriteSizesByVersion: Record<string, number> = {
  "red-blue": OPTION_LARGE,
  yellow: OPTION_LARGE,
  "gold-silver": OPTION_LARGE,
  crystal: OPTION_LARGE,
  "ruby-sapphire": OPTION_SMALL,
  emerald: OPTION_SMALL,
  "firered-leafgreen": OPTION_SMALL,
  "diamond-pearl": OPTION_MEDIUM,
  platinum: OPTION_MEDIUM,
  "heartgold-soulsilver": OPTION_MEDIUM,
  "black-white": OPTION_MEDIUM,
  colosseum: OPTION_MEDIUM,
  xd: OPTION_MEDIUM,
  "black-2-white-2": OPTION_MEDIUM,
  "x-y": OPTION_SMALL,
  "omega-ruby-alpha-sapphire": OPTION_LARGE,
  "sun-moon": OPTION_MEDIUM,
  "ultra-sun-ultra-moon": OPTION_MEDIUM,
  "lets-go-pikachu-lets-go-eevee": OPTION_LARGE,
  "sword-shield": OPTION_MEDIUM,
  "the-isle-of-armor": OPTION_MEDIUM,
  "the-crown-tundra": OPTION_MEDIUM,
  "brilliant-diamond-and-shining-pearl": OPTION_MEDIUM,
  "legends-arceus": OPTION_MEDIUM,
  "scarlet-violet": OPTION_MEDIUM,
};
