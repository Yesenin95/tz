import React from 'react';
import style from '../styles/card.module.css';



// Компонент для отображения одной карточки книги
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
interface BookCardListProps {
   books: any[]; // You can specify a more specific type for books if needed
   isLoading: boolean;
   allBooksLoaded: boolean;
   onLoadMoreClick: () => void;
}
// Компонент для отображения списка карточек книг
export default function BookCardList({
   books,
   isLoading,
   allBooksLoaded,
   onLoadMoreClick,
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