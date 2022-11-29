import { auth } from "./firebase-config.js";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "./pages/Login";
import Main from "./pages/Main";

/**
 *
 * @describe проверка аутентификации и в зависимости от результата возвращает либо основную странцу Main,
 * либо окно аутентификации
 */

function App() {
  const [user] = useAuthState(auth);
  return <div className="App">{user ? <Main /> : <Login />}</div>;
}

export default App;
