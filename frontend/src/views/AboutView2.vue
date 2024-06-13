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
import axios from 'axios';
import { EventBus } from '../main.js';

export default {
  name: 'App',
  components: {
    MenuC,
    voiceorder,
    Count,
    menuCategory
  },
  data() {
    return {
      recognition: null,
    };
  },
  mounted() {
    this.startRecognition();
  },
  methods: {
    startRecognition() {
      this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      this.recognition.lang = 'ko-KR';
      this.recognition.start();

      this.recognition.onresult = async (event) => {
        const speechResult = event.results[0][0].transcript.trim();
        console.log('Result:', speechResult);

        const response = await fetch('http://localhost:5001/recognize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ speech: speechResult }),
        });

        //const data = await response.json();
        //console.log('Order data:', data);

        if (speechResult.includes('세트')|| speechResult.includes('새트')) {
          EventBus.$emit('sendMenuCategory', 'set');
        } else if (speechResult.includes('단품') || speechResult.includes('햄버거 단품')|| speechResult.includes('단풍')) {
          EventBus.$emit('sendMenuCategory', 'burger');
        } else if (speechResult.includes('사이드')) {
          EventBus.$emit('sendMenuCategory', 'side');
        } else if (speechResult.includes('음료')|| speechResult.includes('음요')) {
          EventBus.$emit('sendMenuCategory', 'drink');
        } else if (speechResult.includes('결제')) {
          EventBus.$emit('openWindow');
        } else if (speechResult.includes('전체 삭제')) {
          EventBus.$emit('clearAll');
        } else if (speechResult.includes('이전')) {
          EventBus.$emit('prev');
        } else if (speechResult.includes('다음')) {
          EventBus.$emit('next');
        } else if (speechResult.includes('더블 불고기 버거') || speechResult.includes('더블불고기버거')) {
          this.speachItem('더블 불고기 버거');
        } else if (speechResult.includes('슈슈 버거') || speechResult.includes('슈슈버거')) {
          this.speachItem('슈슈 버거');
        }
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event);
      };

      // 음성 인식이 종료될 때 다시 시작
      this.recognition.onend = () => {
        this.recognition.start();
      };
    },
    async speachItem(item) {  // 음성인식으로 물품 고를때 이 함수 사용 (코드 수 감소)
      const response = await axios.get(`http://localhost:8000/price/${item}`);
      const data = {p_name: item, p_price: response.data};
      EventBus.$emit('add-to-cart', data);
    },
  }
}
  
</script>
  
  