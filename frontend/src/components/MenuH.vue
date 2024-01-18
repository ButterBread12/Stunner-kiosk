<template>
  <div class="kiosk-menu">
    <h1>햄버거 키오스크 메뉴</h1>
    <ul>
      <li v-for="item in shoppingCart" :key="item.id" class="menu-item">
        <div class="item-info">
          <h2>{{ item.p_name }}</h2>
          <p class="description">{{ item.description }}</p>
          <p class="ingredients">{{ item.p_ingredient }}</p>
        </div>
        <div class="item-price">{{ Math.floor(item.p_price) }}원</div>
        <button @click="addToCart(item)" class="add-to-cart-button">장바구니에 추가</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import { EventBus } from '../main';  // 수정된 부분

export default {
  data() {
    return {
      shoppingCart: [],
    };
  },
  methods: {
    addToCart(item) {
      EventBus.$emit('add-to-cart', item);  // 수정된 부분
    },
    async getDataFromServer() {
      try {
        const response = await axios.get('http://localhost:8000/data');
        const data = response.data;
        this.shoppingCart = data;
        console.log('서버에서 받은 데이터:', this.shoppingCart);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    },
  },
  mounted() {
    this.getDataFromServer();
  },
};
</script>
<style scoped>
.kiosk-menu {
  margin: 20px;
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
}

.item-info {
  flex: 2;
}

h2 {
  margin: 0;
  font-size: 18px;
}

.description,
.ingredients {
  margin: 5px 0;
  font-size: 14px;
  color: #555;
}

.add-to-cart-button {
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.item-price {
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
}
</style>