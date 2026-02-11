<template>
  <div class="navigation_holder">
    <svg class="navigation_svg" viewBox="0 0 375 200" fill="none" xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none">
      <g filter="url(#filter0_d_1764_407)">
        <path
          d="M0 70C0 58.9543 8.95431 50 20 50H136.004C142.513 50 148.076 51.8894 151.949 57.1201C159.903 67.8596 166.557 83 187.5 83C208.481 83 215.75 67.8049 223.985 57.062C227.945 51.8962 233.487 50 239.996 50H355C366.046 50 375 58.9543 375 70V233H0V70Z"
          fill="white" />
      </g>
      <defs>
        <filter id="filter0_d_1764_407" x="-40" y="0" width="455" height="263" filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha" />
          <feOffset dy="-10" />
          <feGaussianBlur stdDeviation="20" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.584583 0 0 0 0 0.660451 0 0 0 0 0.766667 0 0 0 0.15 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1764_407" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1764_407" result="shape" />
        </filter>
      </defs>
    </svg>

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
  height: 7rem;
  bottom: 0;
  left: 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-around;
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
}

.navigation_item_icon_special {
  border-radius: 50%;
  height: 5rem;
  width: 5rem;
  background-color: #042628;
  color: #ffffff;
  margin-bottom: 9rem;
}

@media (max-width: 768px) {
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
    margin-bottom: 5.5rem;
  }
}
</style>