import React, { useState } from "react";
import "./App.css";

const App2 = () => {
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, -1, 1, 0, 0, 0],
    [0, 0, 0, 1, -1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [currentState, setCurrentState] = useState(1);

  const handleClick = (x, y) => {
    const deepCopy = JSON.parse(JSON.stringify(board));
    deepCopy[x][y] = currentState;
    setBoard(deepCopy);
  };

  return (
    <>
      {board.map((rows, x) => {
        return (
          <div key={x}>
            {rows.map((v, y) => (
              <span keys={`${x}${y}`} onClick={(e) => handleClick(x, y)}>
                {v}
              </span>
            ))}
          </div>
        );
      })}
    </>
  );
};

function App() {
  var initialBoard = new Array(8);
  for (var i = 0; i < 8; i++) {
    initialBoard[i] = new Array(8).fill(0);
  }
  initialBoard[3][3] = -1;
  initialBoard[4][4] = -1;
  initialBoard[3][4] = 1;
  initialBoard[4][3] = 1;
  const [board, setBoardState] = useState(initialBoard);
  const [currentState, setCurrentState] = useState(-1); //黒

  //置けるかどうかを判断する;
  // board[x][y] 置く位置
  // state 置く色（1,-1）
  const isCanBePlaced = (x, y, state) => {
    //board[x][y]が0かどうかを判断する
    if (board[x][y] !== 0) return false;
    //隣接に敵のコマがあるか
    var flag = false;

    for (var i = -1; i <= 1; i++) {
      for (var j = -1; j <= 1; j++) {
        if (board[x + i][y + j] === state * -1) {
          //隣接に敵のコマがある場合、自分の色までループできるか
          for (var k = 1; k <= 8; k++) {
            if (board[x + i * k][x + j * k] === state) flag = true;
            if (x + i * k > 8 || x + j * k > 8) break;
            if (x + i * k < 0 || x + j * k < 0) break;
          }
        }
      }
    }
    //8方向に自分の駒があるかどうか
    return flag;
  };

  //board配列の状態を更新する;
  // location 置く位置
  // state 置く色（1,-1）
  // const updateBoard = (x, y, state) => {
  //   //ひっくり返す処理
  //   var flag = false;
  //   for (var i = -1; i <= 1; i++) {
  //     for (var j = -1; j <= 1; j++) {
  //       if (board[x + i][y + j] == state * -1) {
  //         //隣接に敵のコマがある場合、自分の色までループできるか
  //         var reversePointX = -1;
  //         var reversePointY = -1;
  //         for (var k = 1; k <= 8; k++) {
  //           if (board[x + i * k][y + j * k] == state) {
  //             reversePointX = x + i * k;
  //             reversePointY = y +j *k;
  //             return [(reversePointX, reversePointY)];
  //           }
  //           if (x + i * k < 8 || x + j * k < 8) break;
  //         }
  //       }
  //     }
  //   }

  //   if (flag) {
  //   }
  // };

  const handleOnClick = (x, y) => {
    if (isCanBePlaced(x, y, currentState)) {
      board[x][y] = currentState;
      setBoardState((prevBoard) => {
        const board = [...prevBoard];
        board[x] = [...board[x]];
        board[x][y] = currentState;
        return board;
      });
      //updateBoard(x, y, currentState);
      setCurrentState(currentState * -1);
    }
  };

  return (
    <div className="App">
      <div>
        {board.map((rows, x) => {
          return (
            <div key={x}>
              {rows.map((item, y) => {
                return (
                  <>
                    <span key={y} onClick={(e) => handleOnClick(x, y)}>
                      {item}{" "}
                    </span>
                  </>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App2;
