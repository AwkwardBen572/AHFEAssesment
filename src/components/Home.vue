<template>
  <div class="home_holder" v-if="recipes">
    <div class="home_sub_holder">
      <div class="home_heading_holder">
        <div class="greetings_name_holder">
          <div class="greetings font_size">
            <div class="greetings_time_of_day"><i :class="timeOfDayIcon" class="time_of_day_icon"></i>Good {{ greeting
              }}
            </div>
          </div>
          <div class="name font_size_xl">
            {{ user.user_name }} {{ user.user_surname }}
          </div>
        </div>
        <div class="store_icon_holder">
          <i class="fa fa-shopping-cart font_size_xl"></i>
        </div>
      </div>
    </div>

    <div class="featured_holder">
      <div class="featured_heading_holder font_size_l">
        Featured
      </div>
      <div class="featured_items_holder">
        <div class="featured_items_sub_holder">
          <div class="featured_item" v-for="(featuredItem, index) in featuredItems" :key="index" :style="{
            backgroundImage: `url(${featuredItem.url})`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }">
            <div class="featured_item_label_holder">

              <div class="featured_item_label font_size_l">
                {{ featuredItem.label }}
              </div>

              <div class="featured_item_info">
                <div class="featured_item_creator">
                  <div class="featured_item_pfp" :style="{
                    backgroundImage: `url(${featuredItem.pfp_url})`,
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }"></div>{{ featuredItem.creator }}
                </div>
                <div class="featured_item_cooking_time">
                  <i class="fa fa-clock-o" style="margin-right: 0.3rem"></i>{{
                    convertCookingTime(featuredItem.cooking_time) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="category_holder">
      <div class="category_heading_holder">
        <div class="category_heading font_size_l">Category</div>
        <div class="see_all_holder font_size">See All</div>
      </div>
      <div class="categories_holder">
        <div class="categories_sub_holder">
          <div class="category_item_holder font_size" v-for="(category, index) in categories" :key="index"
            @click="setCategory(category)">
            <div class="category_item_active" v-if="selectedCategory == category.key">{{ category.label }}</div>
            <div class="category_item" v-else>{{ category.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="popular_recipes_holder">
      <div class="popular_recipes_heading_holder">
        <div class="popular_recipes_heading font_size_l">Popular Recipes</div>
        <div class="see_all_holder font_size">See All</div>
      </div>
      <div class="popular_recipes">
        <div class="popular_recipes_sub_holder">
          <div class="popular_recipe_item_holder font_size" v-for="(recipe, index) in filteredRecipes" :key="index" >
            <div class="popular_recipe_item" @click="openRecipe(recipe)">
              <div class="recipe_image_holder" :style="{
                backgroundImage: `url(${recipe.images[2].url})`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat'
              }">
                <div class="add_to_favs_holder">
                  <div :class="['add_to_favs', isFavorite(recipe) ? 'fas fa-heart favorited' : 'far fa-heart']"
                    @click.stop="addToFavs(recipe)"></div>
                </div>
              </div>
              <div class="recipe_desc_holder">
                <div class="recipe_title_holder font_size_s">
                  {{ formatTitle(recipe.title) }}
                </div>
                <div class="recipe_info_holder font_size_xs">
                  <div>
                    <i class="fas fa-fire-alt" style="margin-right: 0.3rem"></i>{{recipe.meta.nutrients.find(n =>
                      n.label === 'Kcal').amount}} Kcal
                  </div>
                  <div>
                    <i class="fa fa-clock-o" style="margin-right: 0.3rem"></i>{{
                      convertCookingTime(recipe.meta.cooking_time) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { afrihostStore } from "../data/afrihostStore"
import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"
import asianNoodles from '../assets/featured_items/asian_noodles.png'
import frenchToast from '../assets/featured_items/french_toast.png'
import jamesSpader from '../assets/featured_items/james_spader.jpg'
import peterParker from '../assets/featured_items/peter_parker.jpg'

const router = useRouter()
const store = afrihostStore()

const recipes = ref(null)
const favoriteRecipes = ref([])

const user = store.getUserData()
const timeOfDay = new Date().getHours()
const timeOfDayIcon = ref("fa fa-moon-o")
const greeting = ref("Morning")

if (timeOfDay >= 7 && timeOfDay < 12) {
  timeOfDayIcon.value = "fa fa-sun-o"
}
else if (timeOfDay >= 12 && timeOfDay < 17) {
  greeting.value = "Afternoon"
  timeOfDayIcon.value = "fa fa-sun-o"
}
else if (timeOfDay >= 18 && timeOfDay < 23) greeting.value = "Evening"

const featuredItems = ref([
  { key: "asian_noodles", label: "Asian Noodles with extra seafood", url: asianNoodles, cooking_time: 900, creator: "James Spader", pfp_url: jamesSpader },
  { key: "french_toast", label: "French Toast with berries and syrup", url: frenchToast, cooking_time: 1800, creator: "Peter Parker", pfp_url: peterParker }
])

const categories = ref([
  { key: "all", label: "All", active: 1 },
  { key: "breakfast", label: "Breakfast", active: 0 },
  { key: "lunch", label: "Lunch", active: 0 },
  { key: "dinner", label: "Dinner", active: 0 },
  { key: "desert", label: "Desert", active: 0 },
])
const selectedCategory = ref("all")

const filteredRecipes = computed(() => {
  if (!recipes.value) return []

  if (selectedCategory.value === "all") {
    return recipes.value
  }

  return recipes.value.filter(
    recipe => recipe.category === selectedCategory.value
  )
})

const setCategory = (category) => {
  selectedCategory.value = category.key
}

const formatTitle = (title) => {
  if (!title) return ""
  if (title.length <= 16) return title
  else return title.slice(0, 16) + ".."
}

const convertCookingTime = (cookingTime) => {
  const minutes = Math.round(cookingTime / 60)
  return minutes + " min"
}

const openRecipe = (recipe) => {
  router.push({ name: 'Details', params: { id: recipe.id } })
}

const addToFavs = (item) => {
  store.filterFavorites(item)
  favoriteRecipes.value = store.getFavorites()
}

const isFavorite = (item) => {
  return favoriteRecipes.value.some(fav => fav.id === item.id)
}

onMounted(async () => {
  const data = await store.getRecipes()
  recipes.value = data.recipes

  const favs = store.getFavorites()
  if (favs) favoriteRecipes.value = favs
})
</script>

<style scoped>
.home_holder {
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  margin-bottom: 10rem;
}

.home_sub_holder {
  width: 85%;
  display: flex;
  flex-flow: column nowrap;
}

.home_heading_holder {
  width: 100%;
  height: 15rem;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}

.greetings_name_holder {
  width: 100%;
  height: 100%;
}

.greetings {
  width: 100%;
  height: 45%;
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;
  font-family: "sofia_pro_light_az";
}

.greetings_time_of_day {
  height: 20%;
}

.time_of_day_icon {
  color: #67bed9;
  height: 25%;
  margin-right: 0.75rem;
}

.name {
  width: 100%;
  height: 45%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  font-family: "sofia_pro_semi_bold_az";
}

.store_icon_holder {
  width: 15%;
  height: 45%;
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;
  justify-content: flex-end;
  color: #042628;
}

.featured_holder {
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}

.featured_heading_holder {
  width: 85%;
  height: 5rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  font-family: "sofia_pro_semi_bold_az";
}

.featured_items_holder {
  width: 100%;
  height: 15rem;
  display: flex;
  flex-flow: row nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
}

.featured_items_holder::-webkit-scrollbar {
  display: none;
}

.featured_items_sub_holder {
  display: flex;
  flex-flow: row nowrap;
  gap: 1rem;
  width: max-content;
  padding-left: 7%;
}

.featured_item {
  width: 30rem;
  height: 100%;
  flex: 0 0 auto;
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;
  justify-content: center;
  background-color: #67bed9;
  border-radius: 1rem;
}

.featured_item_label_holder {
  width: 90%;
  height: 60%;
  display: flex;
  flex-flow: column nowrap;
  color: #ffffff;
}

.featured_item_label {
  width: 80%;
  height: 60%;
  font-family: "sofia_pro_semi_bold_az";
}

.featured_item_info {
  width: 100%;
  height: 30%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  font-family: "sofia_pro_light_az";
}

.featured_item_creator {
  width: 60%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

.featured_item_pfp {
  width: 15%;
  height: 80%;
  border-radius: 50%;
  border: 0.1rem solid #ffffff;
  margin-right: 1rem;
  background-color: blue;
}

.featured_item_cooking_time {
  width: 40%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
}

.category_holder,
.popular_recipes_holder {
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}

.category_heading_holder,
.popular_recipes_heading_holder {
  width: 85%;
  height: 5rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  font-family: "sofia_pro_semi_bold_az";
}

.category_heading,
.popular_recipes_heading {
  width: 90%;
}

.see_all_holder {
  width: 10%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  font-family: "sofia_pro_semi_bold_az";
  color: #67bed9;
  cursor: pointer;
}

.categories_holder {
  width: 100%;
  height: 3rem;
  display: flex;
  flex-flow: row nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
}

.categories_sub_holder {
  display: flex;
  flex-flow: row nowrap;
  gap: 2rem;
  width: max-content;
  padding-left: 7%;
}

.category_item_holder {
  width: 10rem;
  height: 100%;
}

.category_item,
.category_item_active {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  border-radius: 2rem;
  font-family: "sofia_pro_light_az";
  color: #042628;
  cursor: pointer;
  background-color: #f1f5f5;
}

.category_item_active {
  background-color: #67bed9;
  color: #ffffff;
}

.popular_recipes {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
}

.popular_recipes_sub_holder {
  display: flex;
  flex-flow: row nowrap;
  gap: 2rem;
  width: max-content;
  padding-left: 7%;
}

.popular_recipe_item_holder {
  width: 13rem;
  height: 18rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

.popular_recipe_item {
  width: 100%;
  height: 90%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  align-items: center;
  border-radius: 2rem;
  font-family: "sofia_pro_light_az";
  color: #042628;
  cursor: pointer;
  box-shadow: 0.1rem 0.1rem 1rem 0.1rem rgba(0, 0, 0, 0.4);
}

.recipe_image_holder {
  width: 80%;
  height: 55%;
  border-radius: 2rem;
}

.add_to_favs_holder {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
}

.add_to_favs {
  padding: 0.5rem;
  border-radius: 0.3rem;
  margin-right: 0.8rem;
  margin-top: 0.8rem;
  background-color: #e9e9e9;
  color: #042628;
}

.recipe_desc_holder {
  width: 90%;
  height: 30%;
}

.recipe_title_holder {
  font-family: "sofia_pro_bold_az";
  margin-bottom: 0.5rem;
}

.recipe_info_holder {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  color: #bcbcbc;
  font-family: "sofia_pro_regular_az";
}

@media (max-width: 768px) {
  .home_holder {
    margin-bottom: 5rem;
  }

  .home_heading_holder {
    height: 6rem;
  }

  .greetings_time_of_day {
    height: 35%;
  }

  .time_of_day_icon {
    margin-right: 0.50rem;
  }

  .featured_heading_holder {
    height: 3.5rem;
  }

  .featured_items_holder {
    width: 100%;
    height: 12rem;
  }

  .featured_items_sub_holder {
    padding-left: 7%;
  }

  .featured_item {
    width: 18rem;
    height: 90%;
  }

  .category_heading {
    width: 80%;
  }

  .see_all_holder {
    width: 20%;
  }

  .categories_sub_holder {
    gap: 1rem;
  }

  .popular_recipes_sub_holder {
    gap: 1rem;
  }

  .popular_recipe_item_holder {
    width: 12rem;
    height: 18rem;
  }

  .popular_recipe_item {
    width: 100%;
    height: 90%;
  }

  .recipe_image_holder {
    width: 85%;
    height: 55%;
  }
}
</style>