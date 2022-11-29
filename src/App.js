import { auth } from "./firebase-config.js";
import { useAuthState } from "react-firebase-hooks/auth";
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
import TodoForm from "./components/TodoForm";
import Login from "./pages/Login";
import Main from "./pages/Main";

function App() {
  const [user] = useAuthState(auth);
  console.log(user);
  return <div className="App">{user ? <Main /> : <Login />}</div>;
}

export default App;
