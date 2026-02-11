import { defineStore } from 'pinia'

export const afrihostStore = defineStore('user', {
    state: () => ({
        userData: null,
        recipeDate: null,
        favorites: []
    }),
    actions: {
        getUserData() {
            return {
                user_name: "Alena",
                user_surname: "Sabyan"
            }
        },
        async getRecipes() {
            try {
                const res = await fetch(
                    `https://www.afrihost.com/assessments/2603-fe-mid/recipes.json`
                )
                return await res.json()
            } catch (err) {
                console.error("Failed to load recipe:", err)
            }
        },
        async getRecipe(id) {
            try {
                const res = await fetch(
                    `https://www.afrihost.com/assessments/2603-fe-mid/recipes/${id}.json`
                )
                return await res.json()
            } catch (err) {
                console.error("Failed to load recipe:", err)
            }
        },
        filterFavorites(item) {
             if (!this.favorites.find(fav => fav.id === item.id)) {
                this.favorites.push(item)
            } else {
                this.favorites = this.favorites.filter(fav => fav.id !== item.id);
            }
        },
        getFavorites() {
            return this.favorites
        }
    }
})