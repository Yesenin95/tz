import React from 'react';
import style from '../styles/card.module.css';




/**
 * Компонент BookCard отображает карточку, отображающую информацию о книге, включая ее обложку,
 * название, категорию и авторов.
 * @param {any}  - Компонент BookCard принимает один параметр под названием «book». Этот параметр
 * представляет собой объект, представляющий книгу. Объект должен иметь свойство VolumeInfo, которое
 * содержит информацию о книге, такую как ее название, категории, авторы и ссылки на изображения.
 * @returns элемент JSX, представляющий карточку, отображающую информацию о книге.
 */
function BookCard({ book }:any) {
   return (
      <div className={style.card}>
         <img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} />
         <h2>{book.volumeInfo.title}</h2>
         <p>
            {book.volumeInfo.categories ? book.volumeInfo.categories[0] : 'Категория не указана'}
         </p>
         {renderAuthors(book.volumeInfo.authors)}
      </div>
   );
}
/* Интерфейс BookCardListProps определяет реквизиты, которые можно передать компоненту BookCardList. Он
определяет следующие реквизиты: */
interface BookCardListProps {
   books: any[]; 
   isLoading: boolean;
   allBooksLoaded: boolean;
   onLoadMoreClick: () => void;
}
// Компонент для отображения списка карточек книг
export default function BookCardList({
   books,
}: BookCardListProps) {
   return (
      <div>
         <p>Найдено книг: {books.length}</p>
         <div className={style.cards}>
            {books.map((book, index) => (
               <BookCard key={index} book={book} />

            ))}
         </div>

      </div>
   );
}

/**
 * Функция renderAuthors принимает входные данныеauthors и возвращает элемент JSX, который отображает
 * имена авторов, при этом отображается максимум два имени и указывается, есть ли еще авторы. Если ввод
 * `авторы` не предоставлен, отображается сообщение о том, что автор не указан.
 * @param {any} authors - Параметр `authors` имеет тип `any`, что означает, что он может иметь любой
 * тип данных. Это может быть одно имя автора в виде строки, массив имен авторов или оно может быть
 * нулевым или неопределенным, если автор не указан.
 * @returns Функция renderAuthors возвращает элемент JSX.
 */
function renderAuthors(authors: any) {
   if (!authors) {
      return <p>Автор не указан</p>;
   }

   if (Array.isArray(authors)) {
      // Обрезаем массив авторов, если их больше двух
      const truncatedAuthors = authors.slice(0, 2);
      return <p>{truncatedAuthors.join(', ')}{authors.length > 2 ? ' и другие' : ''}</p>;
   }

   return <p>{authors}</p>;
}