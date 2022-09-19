function getAll(P, endpoint) {
  // This is a "Getter for List Getters" 
  // Stores and retrieves references to the functions for get{endpoint}List.
  // Each function will request all of the items in the named endpoint, when called.
  const getAllItems = {
    "berry": P.getBerriesList,
    "berry-firmness": P.getBerriesFirmnesssList,
    "berry-flavor": P.getBerriesFlavorsList,
    "contest-type": P.getContestTypesList,
    "contest-effect": P.getContestEffectsList,
    "super-contest-effect": P.getSuperContestEffectsList,
    "encounter-method": P.getEncounterMethodsList,
    "encounter-condition": P.getEncounterConditionsList,
    "encounter-condition-value": P.getEncounterConditionValuesList,
    "evolution-chain": P.getEvolutionChainsList,
    "evolution-trigger": P.getEvolutionTriggersList,
    "generation": P.getGenerationsList,
    "pokedex": P.getPokedexsList,
    "version": P.getVersionsList,
    "version-group": P.getVersionGroupsList,
    "item": P.getItemsList,
    "item-attribute": P.getItemAttributesList,
    "item-category": P.getItemCategoriesList,
    "item-fling-effect": P.getItemFlingEffectsList,
    "item-pocket": P.getItemPocketsList,
    "machine": P.getMachinesList,
    "move": P.getMovesList,
    "move-ailment": P.getMoveAilmentsList,
    "move-battle-style": P.getMoveBattleStylesList,
    "move-category": P.getMoveCategoriesList,
    "move-damage-class": P.getMoveDamageClassesList,
    "move-learn-method": P.getMoveLearnMethodsList,
    "move-target": P.getMoveTargetsList,
    "location": P.getLocationsList,
    "location-area": P.getLocationAreasList,
    "pal-park-area": P.getPalParkAreasList,
    "region": P.getRegionsList,
    "ability": P.getAbilitiesList,
    "characteristic": P.getCharacteristicsList,
    "egg-group": P.getEggGroupsList,
    "gender": P.getGendersList,
    "growth-rate": P.getGrowthRatesList,
    "nature": P.getNaturesList,
    "pokeathlon-stat": P.getPokeathlonStatsList,
    "pokemon": P.getPokemonsList,
    "pokemon-color": P.getPokemonColorsList,
    "pokemon-form": P.getPokemonFormsList,
    "pokemon-habitat": P.getPokemonHabitatsList,
    "pokemon-shape": P.getPokemonShapesList,
    "pokemon-species": P.getPokemonSpeciesList,
    "stat": P.getStatsList,
    "type": P.getTypesList,
    "language": P.getLanguagesList,
  };

  return getAllItems[endpoint]
}

module.exports = { getAll }