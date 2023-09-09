'use client'
import React, { useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import axios from 'axios';
import BookCardList from '../components/BookCardList';
import style from '../styles/home.module.css';

export default function Home() {
   const [selectedCategory, setSelectedCategory] = useState('all');
   const [selectedSort, setSelectedSort] = useState('relevance');
   const [searchQuery, setSearchQuery] = useState('');
   const [searchResults, setSearchResults] = useState([]);
   const [visibleBooks, setVisibleBooks] = useState(30);

   /**
    * Этот код представляет собой компонент TypeScript React, который обрабатывает вводимые пользователем
    * данные для категорий, сортировки и поисковых запросов, извлекает данные из API Google Книг на основе
    * вводимых пользователем данных и соответствующим образом обновляет результаты поиска. Он также
    * реализует бесконечную прокрутку для загрузки большего количества книг по мере того, как пользователь
    * прокручивает страницу вниз.
    * @param e - Параметр `e` — это объект события, который передается функциям обработчика событий. Он
    * содержит информацию о произошедшем событии, например целевой элемент и его значение.
    */
   const handleCategoryChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
      setSelectedCategory(e.target.value);
   };

   const handleSortChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
      setSelectedSort(e.target.value);
   };

   const handleSearchQueryChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
      setSearchQuery(e.target.value);
   };

   const fetchData = async () => {
      try {
         const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
            params: {
               q: searchQuery,
               subject: selectedCategory === 'all' ? '' : `subject:${selectedCategory}`,
               orderBy: selectedSort,
               maxResults: 30, // Устанавливаем желаемое количество результатов
               key: 'AIzaSyBBzqfqfxLvryo-iGJA10yuWnz1BaDRqtw',
            },
         });

         const books = response.data.items || [];
         setSearchResults(books);
      } catch (error) {
         console.error('Произошла ошибка:', error);
      }
   };


   useEffect(() => {
      if (searchQuery) {
         fetchData();
      }
   }, [searchQuery, selectedCategory, selectedSort]);

   const handleScroll = () => {
      if (
         window.innerHeight + document.documentElement.scrollTop >=
         document.documentElement.offsetHeight - 200
      ) {
         setVisibleBooks((prevVisibleBooks) => prevVisibleBooks + 4);
      }
   };

   useEffect(() => {
      fetchData();
   }, [selectedCategory]);
   const handleKeyDown = (e: { key: string; }) => {
      if (e.key === 'Enter') {
         fetchData();
      }
   };

   return (
      <main className={style.main}>
         <section className={style.header}>
            <h1>Поиск книги</h1>
            <div className={style['custom-input']}>
               <input
                  type="text"
                  placeholder="Введите текст"
                  value={searchQuery}
                  onChange={handleSearchQueryChange}
                  onKeyDown={handleKeyDown}
               />
               <BiSearch onClick={fetchData} />
            </div>
            <section className={style.selects}>
               <div className={style.categories}>
                  <p>Категории</p>
                  <select value={selectedCategory} onChange={handleCategoryChange}>
                     <option value="all">Все категории</option>
                     <option value="art">Искусство</option>
                     <option value="biography">Биография</option>
                     <option value="computers">Компьютеры</option>
                     <option value="history">История</option>
                     <option value="medical">Медицина</option>
                     <option value="poetry">Поэзия</option>
                  </select>
               </div>
               <div className={style.sorted}>
                  <p>Сортировка по</p>
                  <select value={selectedSort} onChange={handleSortChange}>
                     <option value="relevance">По релевантности</option>
                     <option value="newest">Сначала новые</option>
                  </select>
               </div>
            </section>
         </section>

         <BookCardList books={searchResults.slice(0, visibleBooks)} />
      </main>
   );
}