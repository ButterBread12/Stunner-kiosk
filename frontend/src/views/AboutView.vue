<template>
  <div>
    <menu-h />
    <v-row>
      <v-col>
        <order-h />
      </v-col>
      <v-col>
        <count-h />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import MenuH from '../components/MenuH.vue'
import OrderH from '@/components/OrderH.vue'
import CountH from '@/components/CountH.vue';

export default {
  name: 'App',

  components: {
    MenuH,
    OrderH,
    CountH
  },
}
</script>

