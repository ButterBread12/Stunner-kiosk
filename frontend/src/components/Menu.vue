<template>
  <div class="kiosk-menu">
    <ul>
      <li v-for="item in shoppingCart" :key="item.id" class="menu-item" @click="addToCart(item)">
        <div>
          <img :src="item.p_photourl" alt="Product Image" class="product-image"/>
        </div>
        <div>
          <h2>{{ item.p_name }}</h2>
          <p class="ingredients">{{ item.p_ingredient }}</p>
          <div class="item-price">{{ Math.floor(item.p_price) }}원</div>
        </div>
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
    EventBus.$on('sendMenuCategory', this.getDataFromServer);
  },
  methods: {
    addToCart(item) { // 장바구니에 추가 버튼을 누르면 선택한 물품을 다른 컴포넌트에 보내는 함수
      if (item.p_division == 'set') { // 세트메뉴 선택 시 이 루프 내에서 해결
        this.settingSetMenu(item);
      }
      EventBus.$emit('add-to-cart', item);
    },

    settingSetMenu(item) {  // 세트메뉴를 설정하는 함수
      alert(`이것은 ${item.p_name}다.`)
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
  /* 메뉴 전체 영역 스타일 */
  
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  flex: 1 1 50%;
}

.kiosk-menu ul {  
  /* 목록 스타일 초기화 */
  list-style-type: none;
  padding: 0;
}

.menu-item {
  /* 각 메뉴 항목 스타일 */
  max-width: 40%;
  justify-content: space-between;
  padding: 15px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  cursor: pointer;
  display: inline-block;
  margin-right: 3%;
  flex-wrap: wrap; /* 요소가 너무 많을 때 다음 줄로 넘어갈 수 있도록 설정 */
}

.menu-item:active {
  /* 메뉴 항목 클릭 시 활성화 스타일 */
  background-color: rgba(0, 0, 0, 0.1);
}

.menu-item h2 {
  /* 메뉴 항목 이름 스타일 */
  margin: 0;
  font-size: 18px;
}

.ingredients {
  /* 메뉴 항목 재료 스타일 */
  margin: 5px 0;
  font-size: 14px;
  color: #555;
}

.item-price {
  /* 메뉴 항목 가격 스타일 */
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
}

.product-image {
  /* 메뉴 항목 이미지 스타일 */
  width: 20%;
  height: auto;
}
</style>
