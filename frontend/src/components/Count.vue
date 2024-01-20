<template>
  <div class="kiosk-buttons">
    <v-btn @click="clearAll" class="action-button" color="primary" dark>전체삭제</v-btn>
    <v-btn @click="openDialog" class="action-button" color="success" dark>{{ totalPrice }}원 결제하기</v-btn>
    <v-dialog v-model="dialog">
      <!-- 팝업 창 내용 시작 -->
      <v-card>
        <v-card-title>주문 내역 확인</v-card-title>
        <li v-for="(item, itemName) in orderList" :key="itemName" class="order-item">
        <div class="item-name">{{ itemName }}</div>
        <div class="item-price">{{ item.price * item.count }}원</div>
      </li>
        <v-card-actions>
          <v-btn color="primary" dark>결제하기</v-btn>
          <v-btn @click="closeDialog" color="primary" dark>닫기</v-btn>
        </v-card-actions>
      </v-card>
      <!-- 팝업 창 내용 끝 -->
    </v-dialog>
  </div>

  
</template>

<script>
import { EventBus } from '../main.js';
export default {
  data() {
    return {
      orderList: {},
      totalPrice: 0,
      dialog: false,
    };
  },
  mounted() {
    EventBus.$on('add-to-cart', this.addToOrder); // 이벤트 버스로 메뉴의 물품 데이터를 받아옴
    EventBus.$on('sendList', (orderList) => {     // (현재 사용 안함)
      this.orderList = orderList
    });
    EventBus.$on('sendItemName', (itemName) => {  // 삭제할 물품의 이름을 받아옴
      this.$delete(this.orderList, itemName);
    });
  },
  methods: {
    clearAll() {  // 물품 데이터 전체를 삭제하는 함수
      this.orderList = {};
      this.$store.commit('delAllItem');
      EventBus.$emit('clearAll');
    },

    checkout() {  // 결제하는 기능의 함수
      console.log('결제하기');
      //this.$router.push('/calculateh');
    },

    openDialog() {  // 팝업창을 여는 함수
      this.dialog = true;
    },

    closeDialog() { // 팝업창을 닫는 함수
      this.dialog = false;
    },

    addToOrder(item) {  // 주문 내역 확인에 물품 데이터를 추가하는 함수
      if (!this.orderList[item.p_name]) {
        this.$set(this.orderList, item.p_name, { count: 0, price: 0, unitPrice: item.p_price });
      }
      this.orderList[item.p_name].count += 1;
      this.orderList[item.p_name].price = this.orderList[item.p_name].unitPrice;
      console.log("성곤!!!!!", this.orderList[item.p_name].price)
    },
  },
  computed: {
    updateCount() { // vuex에서 받은 객체 형식의 제품이름, 카운트 데이터
      return this.$store.getters.itemCount;
    },

    updateTotalPrice() {  // vuex에서 받은 합계
      return this.$store.getters.getTotalPrice;
    }
  },
  watch: {
    updateCount(newCount) { // 물품의 개수를 반영하는 함수
      console.log('updateCount 함수가 호출되었습니다.', newCount);
      for (const itemName in this.orderList) {
        if (this.orderList.hasOwnProperty(itemName)) {
          const item = this.orderList[itemName];
          const updatedItem = newCount.find(item => item.name === itemName);
          if (updatedItem) {
            item.count = parseInt(updatedItem.count);
            console.log("vuex로 받은 카운트 갯수: ", item.count);
          }
        }
      }
    },

    updateTotalPrice(newPrice) {  // 합계를 반영하는 함수
      this.totalPrice = newPrice
      console.log("vuex로 받은 합계: ", newPrice)
    }
},

};
</script>

<style scoped>
.kiosk-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  max-width: 600px;
  margin: 20px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #f8f8f8;
}

.action-button {
  margin-top: 10px;
  width: 200px;
  height: 50px;
  font-size: 18px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
}
</style>
  