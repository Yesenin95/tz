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

  /**
   * Функция handleCategoryChange обновляет выбранную категорию на основе значения целевого элемента.
   * @param e - Параметр e — это объект события, который представляет событие, вызвавшее изменение. В
   * данном случае это объект, содержащий информацию о событии, например целевой элемент, вызвавший
   * событие.
   */
   const handleCategoryChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
      setSelectedCategory(e.target.value);
   };

   /**
    * Функция handleSortChange обновляет выбранное значение сортировки на основе значения, выбранного в
    * раскрывающемся меню.
    * @param e - Параметр e — это объект события, который представляет событие, вызвавшее изменение. В
    * данном случае это объект, имеющий свойство target. Свойство target — это объект, имеющий свойство
    * value.
    */
   const handleSortChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
      setSelectedSort(e.target.value);
   };

 /**
  * Функция handleSearchQueryChange обновляет переменную состояния searchQuery значением поля ввода.
  * @param e - Параметр e — это объект события, который представляет событие, вызвавшее изменение
  * поискового запроса.
  */
   const handleSearchQueryChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
      setSearchQuery(e.target.value);
   };

/**
 * Функция handleLoadMoreClick используется для загрузки следующей страницы книги при нажатии кнопки
 * «Загрузить больше».
 */
   const handleLoadMoreClick = () => {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);

      // При клике на "Загрузить ещё" загружаем следующую порцию книг
      fetchData(nextPage);
   };

 /**
  * Функция fetchData — это асинхронная функция, которая извлекает данные из API Google Книг на основе
  * предоставленного поискового запроса, выбранной категории и выбранного параметра сортировки и
  * соответствующим образом обновляет состояние результатов поиска.
  * @param {number} page - Параметр page представляет текущий номер страницы результатов поиска. Он
  * используется для расчета начального индекса получения книг из API. Начальный индекс рассчитывается
  * как `(страница – 1) * 30`, где 30 – максимальное количество книг, извлекаемых за один раз.
  */
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

   /* Хук useEffect используется для выполнения побочных эффектов в функциональном компоненте. В этом
   случае перехват useEffect используется для сброса результатов поиска и получения первой партии
   книг при изменении поискового запроса, выбранной категории или выбранной сортировки. */
   useEffect(() => {
      setSearchResults([]); // Сбрасываем результаты поиска при изменении поискового запроса
      if (searchQuery) {
         fetchData(1); // Загружаем первую порцию книг при новом поисковом запросе
      }
   }, [searchQuery, selectedCategory, selectedSort]);

/* Хук useEffect используется для выполнения побочных эффектов в функциональном компоненте. В этом
случае перехват useEffect используется для извлечения книг при изменении состояния currentPage. */
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
