<template>
  <div class="kiosk-menu">
    <div class="grid-container">
      <div v-for="item in paginatedItems" :key="item.id" class="grid-item" @click="addToCart(item)">
        <div class="product-info">
          <img :src="item.p_photourl" alt="Product Image" class="product-image" />
          <h2>{{ item.p_name }}</h2>
          <p class="ingredients">{{ item.p_ingredient }}</p>
        </div>
        <div class="item-price">{{ Math.floor(item.p_price) }}원</div>
      </div>
      <button @click="prevPage" class="page-btn">이전</button>
      <button @click="nextPage" class="page-btn">다음</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { EventBus } from '../main';

export default {
  data() {
    return {
      currentPage: 0,
      itemsPerPage: 9, // 3x3 행렬
      shoppingCart: [],
    };
  },
  computed: {
    paginatedItems() {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.shoppingCart.slice(start, end);
    }
  },
  mounted() {
    EventBus.$on('sendMenuCategory', this.getDataFromServer);
  },
  methods: {
    addToCart(item) {
      if (item.p_division == 'set') {
        this.settingSetMenu(item);
      }
      EventBus.$emit('add-to-cart', item);
    },

    settingSetMenu(item) {
      //alert(`이것은 ${item.p_name}다.`)
    },

    async getDataFromServer(category) {
      try {
        const response = await axios.get(`http://localhost:8000/data/${category}`);
        const data = response.data;
        this.shoppingCart = data;
        console.log('서버에서 받은 데이터:', this.shoppingCart);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    },
    nextPage() {
      if ((this.currentPage + 1) * this.itemsPerPage < this.shoppingCart.length) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    }
  },
};
</script>

<style scoped>
.kiosk-menu {
  background-color: #f0f0f0; /* 변경된 배경색 */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.grid-item {
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.3s ease-in-out;
}

.grid-item:hover {
  transform: translateY(-5px);
}

.product-info {
  padding: 20px;
}

.product-image {
  width: 100%;
  height: auto;
  border-radius: 5px 5px 0 0;
}

.ingredients {
  margin-top: 5px;
  color: #555;
}

.item-price {
  background-color: #007bff; /* 변경된 가격 배경색 */
  color: #fff;
  padding: 10px;
  border-radius: 0 0 5px 5px;
  text-align: center;
}

.page-btn {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.page-btn:hover {
  background-color: #0056b3;
}
</style>