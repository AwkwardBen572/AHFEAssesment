<template>
    <div v-if="recipe" class="details_holder" :style="{
        backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,1), 30%, rgba(255,255,255,0)), url(${recipe.images[2].url})`,
        backgroundRepeat: 'no-repeat'
    }">
        <div class="details_functionality_holder">
            <div class="functionality_icon font_size_l" @click="closeDetails()">
                <i class="fa fa-times"></i>
            </div>
            <div class="functionality_icon" @click.stop="addToFavs(recipe)">
                <i class="far fa-heart"
                    :class="['add_to_favs', isFavorite(recipe) ? 'fas fa-heart favorited' : 'far fa-heart']"
                    ></i>
            </div>
        </div>

        <div class="details_ingredients_holder">
            <div class="details_middle_line_holder">
                <hr class="details_line">
                </hr>
            </div>
            <div class="details_ingredients_heading_holder">
                <div class="details_ingredients_title">
                    <div class="details_ingredients_heading font_size_l">
                        {{ recipe.title }}
                    </div>
                    <div class="details_ingredients_time font_size_xs">
                        <i class="fa fa-clock-o" style="margin-right: 0.3rem"></i>{{
                            convertCookingTime(recipe.meta.cooking_time) }}
                    </div>
                </div>
                <div class="details_ingredients_desc font_size_xs">
                    {{ isExpanded ? recipe.description : formatDesc(recipe.description) }}

                    <span v-if="recipe.description.length > 70"
                        style="color:#042628; cursor: pointer; margin-left: 0.25rem;" @click="toggleDescription">
                        {{ isExpanded ? "View Less" : "View More" }}
                    </span>
                </div>
                <div class="macros_holder">
                    <div class="macros_item font_size_xs" v-for="(nutrient, key) in recipe.meta.nutrients" :key="key">
                        <div class="macro_icon_holder" v-if="nutrient.unit">
                            <div class="macro_icon" :class="nutrient.icon"></div>{{ nutrient.amount }}g {{
                                nutrient.label }}
                        </div>
                        <div class="macro_icon_holder" v-else>
                            <div class="macro_icon" :class="nutrient.icon"></div>{{ nutrient.amount }} {{ nutrient.label
                            }}
                        </div>
                    </div>
                </div>
                <div class="details_selection_holder">
                    <div class="details_selection_item " v-for="recipeInfoItem in recipeInfoItems"
                        @click="setSelectedDetail(recipeInfoItem)">
                        <div class="details_selection_active" v-if="selectedDetail == recipeInfoItem.key">
                            {{
                                recipeInfoItem.label
                            }}
                        </div>
                        <div class="details_selection" v-else>{{ recipeInfoItem.label }}</div>
                    </div>
                </div>

                <div class="ingredients_holder" v-if="selectedDetail == 'ingredients'">
                    <div class="ingredients_heading font_size_l">
                        <div>Ingredients</div>
                        <div class="font_size_xs"
                            style="color:#bcbcbc; font-family: sofia_pro_regular_az; margin-top: 0.5rem">{{
                                recipe.ingredients.length }} Item/s</div>

                    </div>
                    <div class="ingredients_items_holder" v-for="ingredientItem in recipe.ingredients">
                        <div class="ingredient_item">
                            <div class="ingredient_item_image" :style="{
                                backgroundImage: `url(${getIngredientImage(ingredientItem.label) || ''})`,
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }">
                            </div>
                            <div class="ingredient_item_name font_size">
                                {{ ingredientItem.label }}
                            </div>
                            <div class="ingredient_item_amount font_size_s">
                                {{ ingredientItem.quantity }} {{ ingredientItem.unit }}
                            </div>

                        </div>

                    </div>
                </div>

                <div class="instructions_holder" v-if="selectedDetail == 'instructions'">
                    <div class="instructions_heading font_size_l">
                        <div>Instructions</div>
                        <div class="font_size_xs"
                            style="color:#bcbcbc; font-family: sofia_pro_regular_az; margin-top: 0.5rem">{{
                                convertCookingTime(recipe.meta.cooking_time) }}</div>
                    </div>
                    <div class="instructions" v-for="instruction in recipe.instructions">
                        <span v-html="formatInstructions(instruction)"></span>
                    </div>
                </div>
            </div>
        </div>

        <hr class="seperation_line">
        </hr>

        <div class="creator_holder">
            <div class="creator_sub_holder">
                <div class="creator_heading font_size_l">
                    <div>Creator</div>
                </div>
                <div class="creator_info_holder">
                    <div class="creator_pfp_holder">
                        <div class="creator_pfp" :style="{
                            backgroundImage: `url(${nataliaLuca})`,
                            backgroundSize: '100% 100%',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }"></div>
                    </div>
                    <div class="creator_name_holder">
                        <div class="creator_name font_size_l">
                            Natalia Luca
                        </div>
                        <div class="creator_explain font_size">
                            I'm the author and recipe developer.
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="related_recipes_holder">
            <div class="related_recipes_heading_holder">
                <div class="related_recipes_heading font_size_l">Related Recipes</div>
                <div class="see_all_holder font_size">See All</div>
            </div>
            <div class="related_recipes_items">
                <div class="related_recipes_item" v-for="relatedRecipe in relatedRecipes">
                    <div class="related_recipe_image" :style="{
                        backgroundImage: `url(${relatedRecipe.url})`,
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }">
                    </div>
                    <div class="related_recipe_label font_size_s">
                        {{ formatLabel(relatedRecipe.label) }}
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router"
import { afrihostStore } from "../data/afrihostStore"
import { ref, onMounted } from "vue"

import appleCider from "../assets/recipe_images/apple_cider.png"
import avocado from "../assets/recipe_images/avocado.png"
import beefBrisket from "../assets/recipe_images/beef_brisket.png"
import beefStock from "../assets/recipe_images/beef_stock.png"
import bellPepper from "../assets/recipe_images/bell_pepper.png"
import blackBeans from "../assets/recipe_images/black_beans.png"
import breadCrumbs from "../assets/recipe_images/bread_crumbs.png"
import brownSugar from "../assets/recipe_images/brown_sugar.png"
import butter from "../assets/recipe_images/butter.png"
import cherryTomatoes from "../assets/recipe_images/cherry_tomatoes.png"
import chilliPowder from "../assets/recipe_images/chilli_powder.png"
import cilantro from "../assets/recipe_images/cilantro.png"
import cornFlour from "../assets/recipe_images/corn_flour.png"
import egg from "../assets/recipe_images/egg.png"
import flour from "../assets/recipe_images/flour.png"
import garlicPowder from "../assets/recipe_images/garlic_powder.png"
import greekYogurt from "../assets/recipe_images/greek_yogurt.png"
import groundCinnamon from "../assets/recipe_images/ground_cinnamon.png"
import groundTurkey from "../assets/recipe_images/ground_turkey.png"
import groundBlackPepper from "../assets/recipe_images/ground_black_pepper.png"
import lemonWedges from "../assets/recipe_images/lemon_wedges.png"
import lettuce from "../assets/recipe_images/lettuce.png"
import limeJuice from "../assets/recipe_images/lime_juice.png"
import milk from "../assets/recipe_images/milk.png"
import oliveOil from "../assets/recipe_images/olive_oil.png"
import onionPowder from "../assets/recipe_images/onion_powder.png"
import paprika from "../assets/recipe_images/paprika.png"
import pepper from "../assets/recipe_images/pepper.png"
import porkLoin from "../assets/recipe_images/pork_loin.png"
import redOnion from "../assets/recipe_images/red_onion.png"
import salt from "../assets/recipe_images/salt.png"
import tacoSeasoning from "../assets/recipe_images/taco_seasoning.png"
import vanillaEssence from "../assets/recipe_images/vanilla_essence.png"
import vegOil from "../assets/recipe_images/veg_oil.png"
import whiteSugar from "../assets/recipe_images/white_sugar.png"

import nataliaLuca from "../assets/featured_items/natalia_luca.jpg"
import eggAvo from "../assets/recipe_images/egg_avo.jpg"
import beefRice from "../assets/recipe_images/beef_rice.jpg"
import chickenSchnitzel from "../assets/recipe_images/chicken_schnitzel.jpg"

const route = useRoute()
const router = useRouter()
const store = afrihostStore()

const recipe = ref(null)
const favoriteRecipes = ref([])
const isExpanded = ref(false)
const selectedDetail = ref("ingredients")
const recipeInfoItems = ref([
    { key: "ingredients", label: "Ingredients" },
    { key: "instructions", label: "Instructions" }
])
const relatedRecipes = ref([
    { key: "egg_avo", label: "Egg & Avocado on Toast", url: eggAvo },
    { key: "beef_rice", label: "Bowl of Rice and Beef", url: beefRice },
    { key: "chicken_schnitzel", label: "Chicken Schnitzel", url: chickenSchnitzel }
])

const ingredientImages = [
    { key: "apple_cider", label: "Apple cider vinegar", url: appleCider },
    { key: "avocado", label: "Avocado", url: avocado },
    { key: "beef_brisket", label: "Beef Brisket", url: beefBrisket },
    { key: "beef_stock", label: "Beef stock", url: beefStock },
    { key: "bell_pepper", label: "Bell pepper", url: bellPepper },
    { key: "black_beans", label: "Black beans", url: blackBeans },
    { key: "bread_crumbs", label: "Breadcrumbs", url: breadCrumbs },
    { key: "brown_sugar", label: "Brown Sugar", url: brownSugar },
    { key: "butter", label: "Butter", url: butter },
    { key: "butter_filling", label: "Butter (for filling)", url: butter },
    { key: "cherry_tomatoes", label: "Cherry tomatoes", url: cherryTomatoes },
    { key: "chilli_powder", label: "Chili powder", url: chilliPowder },
    { key: "cayenne_pepper", label: "Cayenne pepper (optional)", url: paprika },
    { key: "cilantro", label: "Fresh cilantro", url: cilantro },
    { key: "corn_flour", label: "Cornflour", url: cornFlour },
    { key: "egg", label: "Egg", url: egg },
    { key: "eggs", label: "Eggs", url: egg },
    { key: "flour", label: "All-purpose flour", url: flour },
    { key: "garlic_powder", label: "Garlic Powder", url: garlicPowder },
    { key: "greek_yogurt", label: "Greek yogurt", url: greekYogurt },
    { key: "ground_cinnamon", label: "Ground cinnamon", url: groundCinnamon },
    { key: "ground_turkey", label: "Lean ground turkey or grilled chicken breast", url: groundTurkey },
    { key: "ground_black_pepper", label: "Ground Black Pepper", url: groundBlackPepper },
    { key: "lemon_wedges", label: "Lemon wedges", url: lemonWedges },
    { key: "lettuce", label: "Romaine lettuce or mixed leafy greens", url: lettuce },
    { key: "lime_juice", label: "Lime juice", url: limeJuice },
    { key: "milk", label: "Milk", url: milk },
    { key: "olive_oil", label: "Olive oil", url: oliveOil },
    { key: "olive_oil_binding", label: "Olive oil or mustard (for binding)", url: oliveOil },
    { key: "onion_powder", label: "Onion Powder", url: onionPowder },
    { key: "paprika", label: "Paprika", url: paprika },
    { key: "pepper", label: "Black pepper", url: pepper },
    { key: "pork_loin", label: "Pork loin cutlets", url: porkLoin },
    { key: "red_onion", label: "Red onion", url: redOnion },
    { key: "salt", label: "Salt", url: salt },
    { key: "taco_seasoning", label: "Low-sodium taco seasoning", url: tacoSeasoning },
    { key: "vanilla_essence", label: "Vanilla essence", url: vanillaEssence },
    { key: "veg_oil", label: "Vegetable Oil", url: vegOil },
    { key: "veg_oil_or_butter", label: "Vegetable oil or clarified butter", url: vegOil },
    { key: "white_sugar", label: "Sugar", url: whiteSugar },
]

onMounted(async () => {
    const id = route.params.id
    const data = await store.getRecipe(id)
    recipe.value = data.recipe

    setMacros()
    const favs = store.getFavorites()
    if (favs) favoriteRecipes.value = favs
})

const closeDetails = () => {
    router.push({ name: "Home" })
}

const setSelectedDetail = (selected) => {
    selectedDetail.value = selected.key
}

const toggleDescription = () => {
    isExpanded.value = !isExpanded.value
}

const getIngredientImage = (label) => {
    if (!label) return null
    const ingredient = ingredientImages.find(
        item => item.label.toLowerCase() === label.toLowerCase()
    )
    return ingredient ? ingredient.url : null
}

const addToFavs = (item) => {
    store.filterFavorites(item)
    favoriteRecipes.value = store.getFavorites()
}

const isFavorite = (item) => {
    return favoriteRecipes.value.some(fav => fav.id === item.id)
}

const formatLabel = (title) => {
    if (!title) return ""
    if (title.length <= 10) return title
    else return title.slice(0, 10) + ".."
}

const setMacros = () => {
    const nutrients = recipe.value.meta.nutrients
    for (const key in nutrients) {
        const nutrient = nutrients[key]
        switch (nutrient.label) {
            case "Kcal":
                nutrient.icon = "fas fa-fire-alt"
                break
            case "Carbs":
                nutrient.icon = "fas fa-bread-slice"
                break
            case "Proteins":
                nutrient.icon = "fas fa-drumstick-bite"
                break
            case "Fats":
                nutrient.icon = "fas fa-pizza-slice"
                break
        }
    }
}

const convertCookingTime = (cookingTime) => {
    const minutes = Math.round(cookingTime / 60)
    return `${minutes} min`
}

const formatDesc = (desc) => {
    if (!desc) return ""
    if (desc.length <= 70) return desc
    else return desc.slice(0, 70)
}

const formatInstructions = (instruction) => {
    if (!instruction) return ""
    return instruction + "<br/><br/>"
}
</script>

<style scoped>
.details_holder {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-flow: column nowrap;
    background-color: #fff;
    background-size: 100% 50rem;
}

.details_functionality_holder {
    width: 100%;
    height: 45rem;
    display: flex;
    justify-content: space-between;
}

.functionality_icon {
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.3rem;
    background-color: #fff;
    margin: 1rem 1.5rem 0 1.5rem;
    color: #042628;
    box-shadow: 0.1rem 0.1rem 1rem 0.1rem rgba(0, 0, 0, 0.4);
    cursor: pointer;
}

.details_ingredients_holder {
    width: 100%;
    border-radius: 1.5rem 1.5rem 0 0;
    background-color: #fff;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    margin-bottom: 3rem;
}

.details_middle_line_holder {
    width: 100%;
    height: 2rem;
}

.details_line {
    width: 10%;
    border: none;
    height: 6px;
    border-radius: 2rem;
    background-color: #f1f5f5;
}

.details_ingredients_heading_holder {
    width: 90%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: space-between;
    color: #042628;
}

.details_ingredients_title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 1rem;
}

.details_ingredients_heading {
    width: 60%;
    font-family: "sofia_pro_semi_bold_az";
}

.details_ingredients_time {
    width: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "sofia_pro_regular_az";
    color: #bcbcbc;
}

.details_ingredients_desc {
    font-family: "sofia_pro_light_az";
    color: #bcbcbc;
}

.macros_holder {
    width: 100%;
    height: 5rem;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: space-around;
    font-family: "sofia_pro_regular_az";
    padding: 1rem 0 1.5rem 0;
    gap: 0.5rem;
}

.macros_item {
    width: 45%;
    height: 50%;
    display: flex;
    align-items: center;
}

.macro_icon_holder {
    display: flex;
    align-items: center;
    font-family: "sofia_pro_light_az";
}

.macro_icon {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.7rem;
    border-radius: 0.3rem;
    background-color: #d3dae2;
}

.details_selection_holder {
    width: 100%;
    height: 4rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #d3dae2;
}

.details_selection_item {
    width: 48%;
    height: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.details_selection,
.details_selection_active {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "sofia_pro_semi_bold_az";
    border-radius: 1rem;
    color: #042628;
}

.details_selection_active {
    background-color: #042628;
    color: #fff;
}

.ingredients_holder {
    width: 100%;
}

.ingredients_heading,
.instructions_heading,
.creator_heading {
    width: 100%;
    padding: 1rem 0;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    font-family: "sofia_pro_semi_bold_az";
}

.ingredients_items_holder {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
}

.ingredient_item {
    width: 100%;
    height: 9rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-radius: 1rem;
    box-shadow: 0.1rem 0.1rem 1rem 0.1rem rgba(0, 0, 0, 0.4);
    margin-bottom: 1rem;
}

.ingredient_item_image {
    width: 20%;
    height: 70%;
    border-radius: 1rem;
    background-color: #d3dae2;
    background-size: 50% 90%;
}

.ingredient_item_name {
    width: 50%;
    font-family: "sofia_pro_semi_bold_az";
}

.ingredient_item_amount {
    width: 20%;
    font-family: "sofia_pro_regular_az";
}

.instructions_holder {
    width: 100%;
    font-family: "sofia_pro_regular_az";
}

.instructions {
    width: 50%;
}

.seperation_line {
    width: 90%;
    border: none;
    height: 0.1rem;
    border-radius: 2rem;
    background-color: #f1f5f5;
}

.creator_holder {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
}

.creator_sub_holder {
    width: 90%;
}

.creator_info_holder {
    width: 100%;
    height: 8rem;
    display: flex;
}

.creator_pfp_holder {
    width: 8%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.creator_pfp {
    width: 85%;
    height: 80%;
    border-radius: 50%;
    border: 0.1rem solid #70b9be;
}

.creator_name_holder {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    gap: 0.5rem;
}

.creator_name {
    font-family: "sofia_pro_regular_az";
}

.creator_explain {
    font-family: "sofia_pro_extra_light_az";
}

.related_recipes_holder {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
}

.related_recipes_heading_holder {
    width: 90%;
    height: 5rem;
    display: flex;
    align-items: center;
    font-family: "sofia_pro_semi_bold_az";
}

.related_recipes_heading {
    width: 90%;
}

.see_all_holder {
    width: 10%;
    display: flex;
    justify-content: center;
    font-family: "sofia_pro_semi_bold_az";
    color: #70b9be;
    cursor: pointer;
}

.related_recipes_items {
    width: 90%;
    display: flex;
    gap: 2rem;
}

.related_recipes_item {
    width: 25%;
    height: 20rem;
    border-radius: 1rem;
    gap: 1rem;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    box-shadow: 0.1rem 0.1rem 1rem 0.1rem rgba(0, 0, 0, 0.4);
    margin-bottom: 2rem;
}

.related_recipe_image {
    width: 90%;
    height: 60%;
    border-radius: 1rem;
    background-size: 100% 100%;
}

.related_recipe_label {
    font-family: "sofia_pro_regular_az";
    color: #042628;
}

@media (max-width:768px) {
    .details_holder {
        background-size: 100% 30rem;
    }

    .details_functionality_holder {
        height: 25rem;
    }

    .details_ingredients_holder {
        margin-bottom: 0rem;
    }

    .ingredient_item {
        height: 6rem;
    }

    .instructions {
        width: 100%;
    }

    .ingredient_item_image {
        background-size: 90% 90%;
    }

    .creator_heading {
        padding-bottom: 0.2rem;
    }

    .creator_info_holder {
        height: 5rem;
        gap: 0.5rem;
    }

    .creator_pfp_holder {
        width: 20%;
    }

    .creator_pfp {
        height: 80%;
    }

    .see_all_holder {
        width: 20%;
    }

    .related_recipes_items {
        gap: 1rem;
    }

    .related_recipes_item {
        width: 30%;
        height: 10rem;
    }
}
</style>
