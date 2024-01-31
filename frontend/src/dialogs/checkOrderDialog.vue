<template>
  <v-dialog v-model="dialog">
    <!-- 팝업 창 내용 시작 -->
    <v-card class="order-summary">
      <v-card-title class="order-summary-title">주문 내역 확인</v-card-title>
      <v-card class="order-details">
        <span>주문 내역</span>
        <span>수량</span>
        <span>금액</span>
      </v-card>
      <li v-for="(item, itemName) in orderList" :key="itemName" class="order-item">
        <div class="item-name">{{ itemName }}</div>
        <div class="item-count">{{ item.count }}</div>
        <div class="item-price">{{ item.price * item.count }}원</div>
      </li><br><br>
      <v-card class="total-price">
        <span class="total-price-label">결제 금액</span>
        <span class="total-price-value">{{ totalPrice }}원</span>
      </v-card>
      <v-card-actions class="card-actions">
        <v-btn v-if="!paymentOptionSelected" class="pay-btn" @click="selectOption('매장')">
          <v-img src="https://cdn-icons-png.flaticon.com/512/5452/5452940.png" height="30" width="30"></v-img>
          <span style="color: black;">매장</span>
        </v-btn>
        <v-btn v-if="!paymentOptionSelected" class="pay-btn" @click="selectOption('포장')">
          <v-img src="https://cdn-icons-png.flaticon.com/512/3081/3081098.png" height="30" width="30"></v-img>
          <span style="color: black;">포장</span>
        </v-btn>
        <v-btn v-if="paymentOptionSelected" class="pay-btn" @click="selectPayment('카드결제')">
          <v-img src="https://cdn-icons-png.flaticon.com/512/4341/4341764.png" height="30" width="30"></v-img>
          <span style="color: black;">카드결제</span>
        </v-btn>
        <v-btn v-if="paymentOptionSelected" class="pay-btn" @click="selectPayment('쿠폰결제')">
          <v-img src="https://cdn-icons-png.flaticon.com/512/2089/2089363.png" height="30" width="30"></v-img>
          <span style="color: black;">쿠폰결제</span>
        </v-btn>
        <v-btn dark @click="resetButtons">뒤로가기</v-btn>
        <v-btn @click="closeDialog" class="close-btn" dark>닫기</v-btn>
      </v-card-actions>
    </v-card>
    <!-- 팝업 창 내용 끝 -->
  </v-dialog>
</template>
  
<script>
import { EventBus } from '../main.js';
export default {
  props: {
    dialog: Boolean,
    orderList: Object,
    totalPrice: Number
  },
  data() {
    return {
      paymentDialog: false,
      paymentOptionSelected: false,
    };
  },
  mounted() {
    EventBus.$on('select-option', (option) => { // (매장/포장) 옵션 중 하나 선택하면 (카드 결제/쿠폰결제) 옵션을 불러오기
      this.paymentOptionSelected = true;
    });
  },
  methods: {
    checkout() {  // 결제하는 기능의 함수
      console.log('Checkout');
    },
    closeDialog() {   // 팝업창을 닫는 함수
      this.$emit('update:dialog', false);
    },
    selectOption(option) {  // (매장/포장) 옵션을 선택하는 함수
      console.log('선택한 옵션:', option);
      EventBus.$emit('select-option', option);
    },
    selectPayment(method) { // (카드 결제/쿠폰결제) 옵션을 선택하는 함수
      console.log('선택한 결제 방식:', method);
      EventBus.$emit('select-payment', method);
      if (method === '카드결제') {
        this.$emit('update:dialog1', true);
      }
      else if (method === '쿠폰결제') {
        this.$emit('update:dialog2', true);
      }
    },
    resetButtons() { // (카드 결제/쿠폰결제) 옵션에서 (매장/포장) 옵션으로 돌아가는 함수
      this.paymentOptionSelected = false;
    },
  }
}
</script>
  
<style scoped>
.order-summary {
  max-width: 600px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.order-summary-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
}

.order-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 16px;
  background-color: #eee;
  padding: 10px;
  border-radius: 5px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
}

.item-name,
.item-count,
.item-price {
  flex: 1;
  font-size: 16px;
}

.item-count {
  margin-left: 35px;
  text-align: center;
}

.item-price {
  text-align: right;
  font-weight: bold;
}

.total-price {
  font-size: 18px;
  font-weight: bold;
  margin-top: 15px;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid #3498db;
}

.total-price-label {
  font-size: 16px;
}

.total-price-value {
  font-size: 18px;
  font-weight: bold;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style> 