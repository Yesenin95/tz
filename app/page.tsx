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
   const [isLoading, setIsLoading] = useState(false);
   const [allBooksLoaded, setAllBooksLoaded] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);

   const handleCategoryChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
      setSelectedCategory(e.target.value);
   };

   const handleSortChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
      setSelectedSort(e.target.value);
   };

   const handleSearchQueryChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
      setSearchQuery(e.target.value);
   };

   const handleLoadMoreClick = () => {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);

      // При клике на "Загрузить ещё" загружаем следующую порцию книг
      fetchData(nextPage);
   };

   const fetchData = async (page: number) => {
      setIsLoading(true);

      try {
         const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
            params: {
               q: searchQuery,
               subject: selectedCategory === 'all' ? '' : `subject:${selectedCategory}`,
               orderBy: selectedSort,
               maxResults: 30, // Всегда загружаем максимум 30 книг
               startIndex: (page) * 30, // Вычисляем начальный индекс страницы
               key: 'AIzaSyBBzqfqfxLvryo-iGJA10yuWnz1BaDRqtw',
            },
         });

         const books = response.data.items || [];

         // Если получено меньше книг, чем ожидалось, считаем, что книги закончились
         if (books.length < 30) {
            setAllBooksLoaded(true);
         }

         // Если текущая страница больше 1, добавляем книги к уже загруженным
         if (page > 1) {
            setSearchResults((prevResults): any => [...prevResults, ...books]);
         } else {
            setSearchResults(books);
         }
      } catch (error) {
         console.error('Произошла ошибка:', error);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      setSearchResults([]); // Сбрасываем результаты поиска при изменении поискового запроса
      if (searchQuery) {
         fetchData(1); // Загружаем первую порцию книг при новом поисковом запросе
      }
   }, [searchQuery, selectedCategory, selectedSort]);

   useEffect(() => {
      fetchData(currentPage); // Загружаем книги при изменении текущей страницы
   }, [currentPage]);

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
               />
               <BiSearch onClick={() => fetchData(1)} />
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

         <BookCardList books={searchResults} isLoading={isLoading} allBooksLoaded={allBooksLoaded} onLoadMoreClick={handleLoadMoreClick} />
         {!allBooksLoaded && (
            <div className={style.loadMoreButton}>
               <button onClick={handleLoadMoreClick} disabled={isLoading}>
                  {isLoading ? 'Загрузка...' : 'Загрузить ещё'}
               </button>
            </div>
         )}
      </main>
   );
}
