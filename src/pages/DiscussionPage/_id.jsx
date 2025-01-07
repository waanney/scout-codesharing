//Users detail
import { useEffect, useState } from 'react';
import { fetchBoardDetails_API } from '../../api/index';
import Discussion from '../DiscussionPage/Discussion.jsx';

function Board() {
  const [board, setBoard] = useState(null);
  useEffect(() => {
    // tạm thời const để test sau này dùng react router doom
    const boardId = '677b9ef76b7b6fa44a92c633';
    // call API
    fetchBoardDetails_API(boardId).then(board => {
      setBoard(board);
    });
  }, []);
  return <Discussion board={board} />;
}

export default Board;
