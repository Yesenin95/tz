import React from 'react';
import style from '../styles/card.module.css';
// Компонент для отображения одной карточки книги
function BookCard({ book }) {
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

// Компонент для отображения списка карточек книг
export default function BookCardList({ books, }) {
   return <>
      <p>Найдено книг: {books.length}</p>
      <div className={style.cards}>
         {books.map((book, index) => (
            <BookCard key={index} book={book} />
         ))}
      </div>
   </>;
}



function renderAuthors(authors) {
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