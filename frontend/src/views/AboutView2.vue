<template>
  <div>
    <menu-category />
    <menu-c />
    <v-row>
      <v-col>
        <voiceorder />
      </v-col>
      <v-col>
        <count />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import MenuC from '../components/Menu.vue'
import voiceorder from '@/components/VoiceOrder.vue'
import Count from '@/components/Count.vue'
import menuCategory from '@/components/menuCategory.vue'
import axios from 'axios'
import { EventBus } from '../main.js'

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
      recognition: null
    }
  },
  mounted() {
    this.startRecognition()
  },
  methods: {
    startRecognition() {
      this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
      this.recognition.lang = 'ko-KR'
      this.recognition.start()

      this.recognition.onresult = async (event) => {
        const speechResult = event.results[0][0].transcript.trim()
        console.log('Result:', speechResult)
        
        // 음성 명령 처리
        this.handleSpeechCommand(speechResult)
      }

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event)
        alert('Speech recognition error: ' + event.error)  // 사용자에게 오류 메시지를 알림
      }

      this.recognition.onend = () => {
        console.log('Speech recognition ended, restarting...')
        this.recognition.start()
      }
    },
    async speechItem(item, count = 1) {
      const response = await axios.get(`http://localhost:8000/price/${item}`)
      const data = { p_name: item, p_price: response.data }

      for (let i = 0; i < count; i++) {
        EventBus.$emit('add-to-cart', data)
      }
    },
    parseKoreanNumber(text) {
      const numberMap = {
        '한': 1,
        '두': 2,
        '세': 3,
        '네': 4,
        '다섯': 5,
        '여섯': 6,
        '일곱': 7,
        '여덟': 8,
        '아홉': 9,
        '열': 10,
      }
      return numberMap[text] || 1
    },
    handleSpeechCommand(speechResult) {
      const itemMatch = speechResult.match(/(불고기 버거|더블 불고기 버거|슈슈 버거|더블 빅맥|빅맥 BLT|더블 쿼터파운더 치즈버거|쿼터파운더 치즈버거|맥크리스피 디럭스 버거|맥크리스피 클래식 버거|트리플 치즈 버거|맥스파이시 상하이 버거|1955 버거|맥치킨 모짜렐라 버거|맥치킨|에그 불고기 버거|슈비 버거|베이컨 토마토 디럭스|치즈버거|더블 치즈버거|햄버거)/)
      const quantityMatch = speechResult.match(/(\d+|한|두|세|네|다섯|여섯|일곱|여덟|아홉|열)개/)

      if (itemMatch && quantityMatch) {
        const item = itemMatch[0]
        const quantityText = quantityMatch[1]
        const quantity = isNaN(quantityText) ? this.parseKoreanNumber(quantityText) : parseInt(quantityText, 10)
        this.speechItem(item, quantity)
      } else {
        // 기존의 카테고리 및 기타 명령어 처리
        if (speechResult.includes('세트') || speechResult.includes('새트')) {
          EventBus.$emit('sendMenuCategory', 'set')
        } else if (speechResult.includes('단품') || speechResult.includes('햄버거 단품') || speechResult.includes('단풍')) {
          EventBus.$emit('sendMenuCategory', 'burger')
        } else if (speechResult.includes('사이드')) {
          EventBus.$emit('sendMenuCategory', 'side')
        } else if (speechResult.includes('음료') || speechResult.includes('음요')) {
          EventBus.$emit('sendMenuCategory', 'drink')
        } else if (speechResult.includes('결제')) {
          EventBus.$emit('openWindow')
        } else if (speechResult.includes('전체 삭제')) {
          EventBus.$emit('clearAll')
        } else if (speechResult.includes('이전')) {
          EventBus.$emit('prev')
        } else if (speechResult.includes('다음')) {
          EventBus.$emit('next')
        } else {
          // 단일 항목 처리
          if (speechResult.includes('더블 불고기 버거') || speechResult.includes('더블불고기버거')) {
            this.speechItem('더블 불고기 버거')
          } else if (speechResult.includes('슈슈 버거') || speechResult.includes('슈슈버거')) {
            this.speechItem('슈슈 버거')
          } else if (speechResult.includes('더블 빅맥')) {
            this.speechItem('더블 빅맥')
          } else if (speechResult.includes('빅맥 BLT')) {
            this.speechItem('빅맥® BLT')
          } else if (speechResult.includes('더블 쿼터파운더 치즈버거')) {
            this.speechItem('더블 쿼터파운더® 치즈')
          } else if (speechResult.includes('쿼터파운더 치즈버거')) {
            this.speechItem('쿼터파운더® 치즈 세트버거')
          } else if (speechResult.includes('맥크리스피 디럭스 버거')) {
            this.speechItem('맥크리스피™ 디럭스 버거 세트')
          } else if (speechResult.includes('맥크리스피 클래식 버거')) {
            this.speechItem('맥크리스피™ 클래식 버거')
          } else if (speechResult.includes('트리플 치즈 버거')) {
            this.speechItem('트리플 치즈 버거')
          } else if (speechResult.includes('맥스파이시 상하이 버거')) {
            this.speechItem('맥스파이시® 상하이 버거')
          } else if (speechResult.includes('1955 버거')) {
            this.speechItem('1955® 버거')
          } else if (speechResult.includes('맥치킨 모짜렐라 버거')) {
            this.speechItem('맥치킨® 모짜렐라')
          } else if (speechResult.includes('맥치킨')) {
            this.speechItem('맥치킨®')
          } else if (speechResult.includes('에그 불고기 버거')) {
            this.speechItem('에그 불고기 버거')
          } else if (speechResult.includes('불고기 버거')) {
            this.speechItem('불고기 버거')
          } else if (speechResult.includes('슈비 버거')) {
            this.speechItem('슈비 버거')
          } else if (speechResult.includes('베이컨 토마토 디럭스')) {
            this.speechItem('베이컨 토마토 디럭스')
          } else if (speechResult.includes('치즈버거')) {
            this.speechItem('치즈버거')
          } else if (speechResult.includes('더블 치즈버거')) {
            this.speechItem('더블 치즈버거')
          } else if (speechResult.includes('햄버거')) {
            this.speechItem('햄버거')
          }
        }
      }
    }
  }
}
</script>
