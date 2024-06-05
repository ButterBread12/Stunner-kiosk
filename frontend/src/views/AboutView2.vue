<template>
    <div>
      <menu-category/>
      <menu-c/>
      <v-row>
        <v-col>
          <voiceorder/>
        </v-col>
        <v-col>
          <count/>
        </v-col>
      </v-row>
    </div>
  </template>
  
  <script>
  import MenuC from '../components/Menu.vue'
  import voiceorder from '@/components/voiceorder.vue'
  import Count from '@/components/Count.vue'
  import menuCategory from '@/components/menuCategory.vue'
  
  export default {
    name: 'App',
  
    components: {
      MenuC,
      voiceorder,
      Count,
      menuCategory
    },
  }
  </script>
  
  