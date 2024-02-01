<template>
  <div>
    <!-- 카드결제화면 -->
    <v-dialog v-model="localDialog1" class="payment-dialog">
      <v-card class="order-summary">
        <v-card-title>카드 결제</v-card-title>
        <v-card class="payment-content">
          <h3>다음 그림과 같이 신용/체크카드를 넣어주세요</h3>
          <v-img src="https://cdn0.iconfinder.com/data/icons/business-collection-2027/60/atm-1-512.png" height="200"
            width="200"></v-img>
        </v-card>
        <v-card class="total-price">
          <span class="total-price-label">총 결제 금액</span>
          <span class="total-price-value">{{ totalPrice }}원</span>
        </v-card>
        <v-card-actions class="card-actions">
          <v-btn @click="pay" height="10" width="50" class="cardbox" dark>
            <v-img src="../components/p/card_insert_moving.png" height="100" width="100" class="movecard"></v-img>
          </v-btn>
          <v-btn @click="closeDialog" class="close-btn" dark>닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 쿠폰결제화면 -->
    <v-dialog v-model="localDialog2" class="payment-dialog">
      <v-card class="order-summary">
        <v-card-title>쿠폰 결제</v-card-title>
        <v-card class="payment-content">
          <h3>쿠폰의 바코드를 대주세요</h3><br>
          <v-img src="https://cdn-icons-png.flaticon.com/512/25/25350.png" height="180" width="400"></v-img><br>
        </v-card>
        <v-card class="total-price">
          <span class="total-price-label">총 결제 금액</span>
          <span class="total-price-value">{{ totalPrice }}원</span>
        </v-card>
        <v-card-actions class="card-actions">
          <v-btn @click="pay" height="70" width="100" dark>
            <v-img max-width="90" src="../components/p/barcode.png"></v-img>
          </v-btn>
          <v-btn @click="closeDialog" class="close-btn" dark>닫기</v-btn>
        </v-card-actions>
        <h5 class="bartext">바코드를 대주세요</h5>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { EventBus } from '../main.js';
import axios from 'axios';

export default {
  props: {
    dialog1: Boolean,
    dialog2: Boolean,
    totalPrice: Number
  },
  data() {
    return {
      localDialog1: this.dialog1,
      localDialog2: this.dialog2,
    };
  },
  watch: {
    //checkOrderDialog.vue에서 변경된 dialog1,2 prop의 값을 localDialog1,2에 반영
    dialog1(newVal) {
      this.localDialog1 = newVal;
    },
    dialog2(newVal) {
      this.localDialog2 = newVal;
    }
  },
  mounted() {
    EventBus.$on('select-payment', (method) => { // 이벤트 버스로 해당 페이지(카드결제 OR 쿠폰결제) 화면 불러오기
      if (method === '카드결제') {
        this.localDialog1 = true;
      }
      else if (method === '쿠폰결제') {
        this.localDialog2 = true;
      }
    });
  },
  methods: {
    closeDialog() { // 팝업창을 닫는 함수
      this.localDialog1 = false;
      this.localDialog2 = false;
    },
    async pay() {
      let selectedItems = this.$store.state.items.map(item => `${item.name}(${item.count}개)`).join(', ');
      setTimeout(async () => {
        let message = `주문내역: ${selectedItems}\n총 금액: ${this.totalPrice}원`;
        if (confirm(message)) {
          // API를 호출하여 아두이노로 데이터 전송
          await axios.post('http://localhost:8000/order', {
            message: message
          });
        }
        this.$store.commit('delAllItem');
        location.href = "http://localhost:8080/";
      }, 1000);
    },

    /* pay() {
       // 장바구니에 담긴 물품 문자열로 반환 및 결제 완료 후 장바구니의 모든 아이템을 삭제
       let selectedItems = this.$store.state.items.map(item => `${item.name}(${item.count}개)`).join(', ');
       setTimeout(() => {
         alert(`주문내역: ${selectedItems}\n총 금액: ${this.totalPrice}원\n감사합니다. 결제가 완료되었습니다.`);
         this.$store.commit('delAllItem');
         location.href = "http://localhost:8080/"; //알림창으로 표시 후 메인페이지로 돌아가기
       }, 1000); // 1초 후에 실행되도록 하는 함수
     },*/
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

.pay-btn {
  background-color: #4caf50;
  color: #fff;
}

.close-btn {
  background-color: #f44336;
  color: #fff;
}

.payment-dialog {
  width: 80%;
  max-width: 500px;
}

.payment-content {
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cardbox {
  left: 30px;
  top: -25px;
}

.movecard {
  top: 25px;
}

.bartext {
  margin-left: 12px;
}
</style> 