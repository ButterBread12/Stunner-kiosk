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
        </li>
        <v-card class="total-price">
          <span class="total-price-label">결제 금액</span>
          <span class="total-price-value">{{ totalPrice }}원</span>
        </v-card>
        <v-card-actions class="card-actions">
            <v-btn @click="selectOption('매장')">
              <v-img src="https://cdn-icons-png.flaticon.com/512/5452/5452940.png" height="30" width="30"></v-img>
              <span style="color: black;">매장</span>
            </v-btn>
            <v-btn @click="selectOption('포장')">
              <v-img src="https://cdn-icons-png.flaticon.com/512/3081/3081098.png" height="30" width="30"></v-img>
              <span style="color: black;">포장</span>
            </v-btn>
            <v-btn @click="closeDialog" class="close-btn" dark>닫기</v-btn>
          </v-card-actions>
      </v-card>
      <!-- 팝업 창 내용 끝 -->
    </v-dialog>
  </template>
  
  <script>
  export default {
    props: {
      dialog: Boolean,
      orderList: Object,
      totalPrice: Number
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
      }
    }
  }
  </script>
  
  <style scoped>
  .order-summary {
    max-width: 37.5em;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 0.625em;
    box-shadow: 0 0 0.625em rgba(0, 0, 0, 0.1);
    padding: 1.25em;
  }
  
  .order-summary-title {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 0.9375em;
  }
  
  .order-details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.625em;
    font-size: 1em;
    background-color: #eee;
    padding: 0.625em;
    border-radius: 0.3125em;
  }
  
  .order-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.625em;
    padding: 0.625em;
    border-radius: 0.3125em;
  }
  
  .item-name,
  .item-count,
  .item-price {
    flex: 1;
    font-size: 1em;
  }
  
  .item-count {
    margin-left: 2.1875em;
    text-align: center;
  }
  
  .item-price {
    text-align: right;
    font-weight: bold;
  }
  
  .total-price {
    font-size: 1.125em;
    font-weight: bold;
    margin-top: 0.9375em;
    padding: 0.625em;
    border-radius: 0.3125em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 0.125em solid #3498db;
  }
  
  .total-price-label {
    font-size: 1em;
  }
  
  .total-price-value {
    font-size: 1.125em;
    font-weight: bold;
  }
  
  .card-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 1.25em;
  }
</style>
