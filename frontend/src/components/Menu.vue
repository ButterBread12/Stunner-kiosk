<template>
  <div class="kiosk-menu">
    <ul>
      <li v-for="item in shoppingCart" :key="item.id" class="menu-item">
        <div>
          <img :src="item.p_photourl" alt="Product Image" class="product-image"/>
        </div>
        <div class="column">
          <h2>{{ item.p_name }}</h2>
          <p class="description">{{ item.p_description }}</p>
          <p class="ingredients">{{ item.p_ingredient }}</p>
          <p class="info">{{ item.p_info }}</p>
          <p class="kcal">{{ item.p_kcal }}kcal</p>
          <div class="item-price">{{ Math.floor(item.p_price) }}원</div> <!-- 후보 1 -->
        </div>
        <div class="item-price">{{ Math.floor(item.p_price) }}원</div> <!-- 후보 2 (위치 변경 필요) -->
        <button @click="addToCart(item)" class="add-to-cart-button">장바구니에 추가</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import { EventBus } from '../main';

export default {
  data() {
    return {
      shoppingCart: [],
    };
  },
  mounted() {
    EventBus.$on('sendMenuCatrgory', this.getDataFromServer);
  },
  methods: {
    addToCart(item) { // 장바구니에 추가 버튼을 누르면 선택한 물품을 다른 컴포넌트에 보내는 함수
      EventBus.$emit('add-to-cart', item);
    },

    async getDataFromServer(category) { // 서버의 데이터를 비동기로 가져오는 함수
      try {
        const response = await axios.get(`http://localhost:8000/data/${category}`);
        const data = response.data;
        this.shoppingCart = data;
        console.log('서버에서 받은 데이터:', this.shoppingCart);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    },
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

.info {
    margin: 5px 0;
    font-size: 14px;
    color: #555;
  }

.column {
  margin-right: 20%;
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

.product-image {
  max-width: 40%;
  height: auto;
}
</style>
