<template>
    <section>
      <ul class="category-list">
        <li v-for="(category, index) in categories" :key="index">
          <button @click="openMenu(category.division)" class="category-item">{{ category.name }}</button>
        </li>
      </ul>
    </section>
</template>
  
<script>
import { EventBus } from '../main';
  export default {
    data() {
      return {
        categories: [
          { name: '세트',
            division: 'set' },
          { name: '버거',
            division: 'burger' },
          { name: '사이드',
            division: 'side' },
          { name: '음료',
            division: 'drink' },
        ],
      };
    },
    methods: {
      openMenu(category) {  // 선택한 카테고리의 메뉴를 열기 위해 이벤트버스로 데이터를 보내는 함수
        EventBus.$emit('sendMenuCatrgory', category);
        console.log('보낸 카테고리: ', category)
      },
    }
  };
</script>
  
<style scoped>
  .category-list {
    display: flex;
    overflow-x: auto;
    padding: 10px;
    justify-content: center;
  }
  
  .category-item {
    flex: 0 0 auto;
    margin-right: 15px;
    padding: 15px;
    width: 150px;
    background-color: #007bff;
    color: white;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease;
    cursor: pointer;
    text-align: center;
    user-select: none; /* 텍스트 드래그 방지 */
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .category-item p {
    margin-top: 10px;
  }
  
  .category-item:hover {
    background-color: #4830a8;
  }
</style>
  