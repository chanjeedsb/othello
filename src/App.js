import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  var initialBoard = new Array(8);
  for (var i = 0; i < 8; i++) {
    initialBoard[i] = new Array(8).fill(0);
  }
  initialBoard[3][3] = -1;
  initialBoard[4][4] = -1;
  initialBoard[3][4] = 1;
  initialBoard[4][3] = 1;

  var emptyBoard = new Array(8);
  for (var i = 0; i < 8; i++) {
    emptyBoard[i] = new Array(8).fill(0);
  }

  const [board, setBoard] = useState(initialBoard);
  const [placeBoard, setplaceBoard] = useState(emptyBoard);
  const [currentState, setCurrentState] = useState(-1); //黒
  const [endGame, setEndGame] = useState(false);
  const [count, setCount] = useState(1);
  const [countWhite, setCountWhite] = useState(0);
  const [countCanNotPlace, setCountCanNotPlace] = useState(0);

  useEffect(() => {
    var countWhiteLocal = 0;
    console.log("end game");
    if (endGame) {
      for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
          if (board[i][j] === 1) countWhiteLocal += 1;
        }
      }
    }
    setCountWhite(countWhiteLocal);
  }, [endGame]);

  useEffect(() => {
    if (countCanNotPlace === 2) {
      console.log("countCanNotPlace");
      setEndGame(true);
    }
  }, [countCanNotPlace]);

  useEffect(() => {
    updatePlaceBoard(-1);
  }, []);

  useEffect(() => {
    updatePlaceBoard(currentState);
  }, [board, currentState]);

  //置けるかどうかを判断する;
  // board[x][y] 置く位置
  // state 置く色（1,-1）
  const isCanBePlaced = (x, y, state) => {
    //board[x][y]が0かどうかを判断する
    if (board[x][y] !== 0) return false;
    // console.log("start");
    for (var i = -1; i <= 1; i++) {
      //boardの範囲外
      if (x + i < 0 || x + i > 7) continue;
      for (var j = -1; j <= 1; j++) {
        //隣接に敵のコマがあるか

        //boardの範囲外
        if (y + j < 0 || y + j > 7) continue;

        if (board[x + i][y + j] === state * -1) {
          //隣接に敵のコマがある場合、自分の色までループできるか
          for (var k = 1; k <= 7; k++) {
            //8方向に自分の駒があるかどうか
            // console.log("find");
            // console.log(state);
            // console.log(x + i * k, y + j * k);

            //boardの範囲外の場合は続き調べない
            if (x + i * k > 7 || y + j * k > 7) break;
            if (x + i * k < 0 || y + j * k < 0) break;

            //空の場合は続き調べない
            if (board[x + i * k][y + j * k] === 0) break;

            //自分の駒がある場合、trueを返す
            if (board[x + i * k][y + j * k] === state) return true;
          }
        }
      }
    }
    return false;
  };

  const updatePlaceBoard = (state) => {
    if (count > 60) {
      console.log(`count=${count}`);
      setEndGame(true);
      return;
    }
    const deepCopy = JSON.parse(JSON.stringify(emptyBoard));
    var countCanPlace = 0;

    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        if (isCanBePlaced(i, j, state)) {
          deepCopy[i][j] = 1;
          countCanPlace += 1;
        }
      }
    }
    if (countCanPlace === 0) {
      //このターン置けない

      console.log(`countCanNotPlace=${countCanNotPlace}`);
      setCountCanNotPlace(countCanNotPlace + 1);
      setCurrentState(currentState * -1);
    } else {
      setplaceBoard(deepCopy);
      setCountCanNotPlace(0);
    }
  };

  //board配列の状態を更新する;
  //location 置く位置
  //state 置く色（1,-1）
  const updateBoard = (x, y, state, newBoard) => {
    //ひっくり返す処理
    for (var i = -1; i <= 1; i++) {
      //boardの範囲外
      if (x + i < 0 || x + i > 7) continue;
      for (var j = -1; j <= 1; j++) {
        //boardの範囲外
        if (y + j < 0 || y + j > 7) continue;

        if (board[x + i][y + j] === state * -1) {
          //隣接に敵のコマがある場合、自分の色までループできるか

          for (var k = 1; k <= 7; k++) {
            //8方向に自分の駒があるかどうか

            //boardの範囲外の場合は続き調べない
            console.log(`k=${k}`);
            if (x + i * k > 7 || y + j * k > 7) break;
            if (x + i * k < 0 || y + j * k < 0) break;
            //空の場合は続き調べない
            if (board[x + i * k][y + j * k] === 0) break;

            //自分の駒がある場合、このターンで置いた駒からその駒までひっくり返す。
            if (board[x + i * k][y + j * k] === state) {
              console.log("起点");
              console.log(x + i * k, y + j * k);
              while (k > 1) {
                //ひっくり返す。
                k -= 1;
                console.log("ひっくり返す");
                console.log(x + i * k, y + j * k);
                newBoard[x + i * k][y + j * k] = state;
              }

              break;
            }
          }
        }
      }
    }
    setBoard(newBoard);
  };

  const handleOnClick = (x, y) => {
    if (isCanBePlaced(x, y, currentState)) {
      console.log(`Turn=${count}`);
      console.log("置ける");
      const deepCopy = JSON.parse(JSON.stringify(board));
      deepCopy[x][y] = currentState;
      updateBoard(x, y, currentState, deepCopy);
      setBoard(deepCopy);
      setCurrentState(currentState * -1);
      updatePlaceBoard(currentState * -1);
      setCount(count + 1);
    }
  };

  const resetBoard = () => {
    setBoard(initialBoard);
    setCurrentState(-1);
    setCountWhite(0);
    setCount(1);
    setCountCanNotPlace(0);
    setEndGame(false);
  };

  return (
    <div className="App">
      <h1>一人オセロ</h1>
      {!endGame ? (
        <h2>
          Turn {count}: {currentState === 1 ? "○" : "●"}
        </h2>
      ) : (
        <h2>
          ○ {countWhite} VS ● {count + 3 - countWhite}
        </h2>
      )}

      <div>
        {board.map((rows, x) => {
          return (
            <div key={x}>
              {rows.map((item, y) => {
                return (
                  <>
                    <span key={y} onClick={(e) => handleOnClick(x, y)}>
                      {item === 0 ? (
                        placeBoard[x][y] === 1 ? (
                          <span style={{ color: "red" }}>□</span>
                        ) : (
                          <span style={{ color: "green" }}>□</span>
                        )
                      ) : item === 1 ? (
                        "○"
                      ) : (
                        "●"
                      )}{" "}
                    </span>
                  </>
                );
              })}
            </div>
          );
        })}
      </div>
      <br />
      <button onClick={resetBoard}>Reset</button>
    </div>
  );
}

export default App;
