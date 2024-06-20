import styled from "styled-components";
import { useRecoilState } from "recoil";
import { IBoard, boardState, todoState } from "./atoms";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Head from "./components/Head";
// import DeleteZone from "./components/DeleteZone";
import Boards from "./components/Boards";

const Main = styled.div``;

const Main1 = styled.div`
  background-color: rgba(223, 209, 235, 0.3);
  border-bottom: 2px solid rgba(299, 299, 299, 0.4);
  height: 30px;
  padding: 15px 50px;
  display: flex;
  align-items: center;
  font-size: 25px;
  font-weight: 700;
  color: white;
  gap: 30px;
  button {
    border: none;
    border-radius: 5px;
    background-color: rgba(299, 299, 299, 0.5);
    padding: 10px;
    font-size: 15px;
    color: #c7a7d9;
    cursor: pointer;
  }
`;

const Main2 = styled.div`
  display: flex;
  margin: 30px 40px;
  /* gap: 20px; */
`;

function App() {
  const [boards, setBoards] = useRecoilState(boardState);
  const [todos, setTodos] = useRecoilState(todoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;
    // 같은 보드 내에서 이동하기
    if (destination.droppableId === source.droppableId) {
      setTodos((allBoards) => {
        const todoCopy = [...allBoards[source.droppableId]];
        const todoObj = todoCopy[source.index];
        todoCopy.splice(source.index, 1);
        todoCopy.splice(destination.index, 0, todoObj);
        return {
          ...allBoards,
          [source.droppableId]: todoCopy,
        };
      });
    }
    // 다른 보드 간 이동하기
    if (destination.droppableId !== source.droppableId) {
      setTodos((allBoards) => {
        const sourceCopy = [...allBoards[source.droppableId]];
        const destinationCopy = [...allBoards[destination.droppableId]];
        const sourceObj = sourceCopy[source.index];
        sourceCopy.splice(source.index, 1);
        destinationCopy.splice(destination.index, 0, sourceObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceCopy,
          [destination.droppableId]: destinationCopy,
        };
      });
    }

    // 삭제 구역으로 이동 (삭제)
    // if (destination.droppableId === "delete_zone") {
    //   setTodos((allBoards) => {
    //     const todoCopy = [...allBoards[source.droppableId]];
    //     todoCopy.splice(source.index, 1);
    //     return {
    //       ...allBoards,
    //       [source.droppableId]: todoCopy,
    //     };
    //   });
    // }
  };

  const handleMakeBoard = () => {
    const newBoard = {
      id: Date.now(),
      name: "new",
      cards: todos,
    };
    setBoards((boards) => {
      return { ...boards, newBoard };
    });
  };
  console.log(boards);

  return (
    <div>
      <Head />
      <Main>
        <Main1>
          <span>Nadia</span>
          <button onClick={handleMakeBoard}>+ New Board</button>
        </Main1>
        <Main2>
          {boards.map((board) => (
            <div key={board.id}>{board.name}</div>
          ))}
          <DragDropContext onDragEnd={onDragEnd}>
            {Object.keys(todos).map((boardId) => (
              <Boards todos={todos[boardId]} boardId={boardId} key={boardId} />
            ))}
            {/* <DeleteZone /> */}
          </DragDropContext>
        </Main2>
      </Main>
    </div>
  );
}

export default App;
