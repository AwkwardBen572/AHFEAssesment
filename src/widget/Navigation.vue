<template>
  <div class="navigation_holder">

    <div class="navigation_item" v-for="(navigationItem, key) in navigationItems">
      <div v-if="navigationItem.key == 'recipe'" :style="{
        backgroundImage: `url(${navigationItem.url})`,
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }" class="navigation_item_icon_special font_size_xl">
      </div>
      <div v-else :class="navigationItem.class" class="navigation_item_icon font_size_xl" :key="key"></div>
    </div>
  </div>
</template>

<script setup>
import chefIcon from '../assets/icons/chef_icon.png'

const navigationItems = [
  { key: "chef", label: "Home", class: "fa fa-home" },
  { key: "search", label: "Search", class: "fa fa-search" },
  { key: "recipe", label: "Chef", url: chefIcon },
  { key: "alert_icon", label: "Alert", class: "far fa-bell" },
  { key: "user", label: "User", class: "far fa-user-circle" }
]

</script>

<style scoped>
.navigation_holder {
  position: fixed;
  width: 100%;
  height: 10rem;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-image: url("../assets/svg/navbar.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  overflow: visible;
}

.navigation_svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}

.navigation_item {
  width: 10%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  color: #858585;
  z-index: 1;
  position: relative;
}

.navigation_item_icon,
.navigation_item_icon_special {
  width: 4rem;
  height: 4rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  cursor: pointer;
}

.navigation_item_icon_special {
  border-radius: 50%;
  height: 10rem;
  width: 10rem;
  background-color: #042628;
  color: #ffffff;
  margin-bottom: 7rem;
}

@media (max-width: 768px) {

  .navigation_holder {
    height: 7rem;
  }

  .navigation_item {
    width: 18%;
  }

  .navigation_item_icon {
    width: 85%;
    margin-top: 2rem;
  }

  .navigation_item_icon_special {
    width: 4rem;
    height: 4rem;
    box-shadow: 0.1rem 0.1rem 1rem 0.1rem rgba(0, 0, 0, 0.4);
    margin-bottom: 5rem;
  }
}
</style>