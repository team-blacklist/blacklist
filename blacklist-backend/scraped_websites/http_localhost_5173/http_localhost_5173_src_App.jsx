import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/App.jsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=7f81cdc9"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=7f81cdc9"; const useEffect = __vite__cjsImport1_react["useEffect"]; const useState = __vite__cjsImport1_react["useState"];
import { createClient } from "/node_modules/.vite/deps/@supabase_supabase-js.js?v=7f81cdc9";
const SUPABASE_URL = "https://bbwvkesgtaeloywqklht.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJid3ZrZXNndGFlbG95d3FrbGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2ODU2NDksImV4cCI6MjA3NjI2MTY0OX0.uCPCITXcvAJvvuMBDPBOiEGQ4cVx_XWHn52nUnZXJXA";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
function App() {
  _s();
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const fetchItems = async () => {
    const { data, error } = await supabase.from("items").select("*");
    if (error) {
      alert("Error fetching items: " + error.message);
      return;
    }
    setItems(data);
  };
  const addItem = async () => {
    if (!name.trim()) return;
    const { error } = await supabase.from("items").insert([{ name }]);
    if (error) {
      alert("Error adding item: " + error.message);
      return;
    }
    setName("");
    fetchItems();
  };
  useEffect(() => {
    fetchItems();
  }, []);
  return /* @__PURE__ */ jsxDEV("div", { style: { padding: 20, fontFamily: "Arial" }, children: [
    /* @__PURE__ */ jsxDEV("h1", { children: "Supabase Demo" }, void 0, false, {
      fileName: "/Users/kellytan/supabase-demo/src/App.jsx",
      lineNumber: 40,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      "input",
      {
        value: name,
        onChange: (e) => setName(e.target.value),
        placeholder: "Enter item name"
      },
      void 0,
      false,
      {
        fileName: "/Users/kellytan/supabase-demo/src/App.jsx",
        lineNumber: 41,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("button", { onClick: addItem, style: { marginLeft: 10 }, children: "Add" }, void 0, false, {
      fileName: "/Users/kellytan/supabase-demo/src/App.jsx",
      lineNumber: 46,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("ul", { children: items.map(
      (item) => /* @__PURE__ */ jsxDEV("li", { children: [
        item.id,
        ": ",
        item.name
      ] }, item.id, true, {
        fileName: "/Users/kellytan/supabase-demo/src/App.jsx",
        lineNumber: 51,
        columnNumber: 9
      }, this)
    ) }, void 0, false, {
      fileName: "/Users/kellytan/supabase-demo/src/App.jsx",
      lineNumber: 49,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/Users/kellytan/supabase-demo/src/App.jsx",
    lineNumber: 39,
    columnNumber: 5
  }, this);
}
_s(App, "D/rJVV40iyWj+0LwiUY2Rzwpo6o=");
_c = App;
export default App;
var _c;
$RefreshReg$(_c, "App");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/Users/kellytan/supabase-demo/src/App.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/Users/kellytan/supabase-demo/src/App.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "/Users/kellytan/supabase-demo/src/App.jsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBdUNNOztBQXZDTixTQUFTQSxXQUFXQyxnQkFBZ0I7QUFDcEMsU0FBU0Msb0JBQW9CO0FBRTdCLE1BQU1DLGVBQWU7QUFDckIsTUFBTUMsZUFBZTtBQUNyQixNQUFNQyxXQUFXSCxhQUFhQyxjQUFjQyxZQUFZO0FBRXhELFNBQVNFLE1BQU07QUFBQUMsS0FBQTtBQUNiLFFBQU0sQ0FBQ0MsT0FBT0MsUUFBUSxJQUFJUixTQUFTLEVBQUU7QUFDckMsUUFBTSxDQUFDUyxNQUFNQyxPQUFPLElBQUlWLFNBQVMsRUFBRTtBQUduQyxRQUFNVyxhQUFhLFlBQVk7QUFDN0IsVUFBTSxFQUFFQyxNQUFNQyxNQUFNLElBQUksTUFBTVQsU0FBU1UsS0FBSyxPQUFPLEVBQUVDLE9BQU8sR0FBRztBQUMvRCxRQUFJRixPQUFPO0FBQ1RHLFlBQU0sMkJBQTJCSCxNQUFNSSxPQUFPO0FBQzlDO0FBQUEsSUFDRjtBQUNBVCxhQUFTSSxJQUFJO0FBQUEsRUFDZjtBQUdBLFFBQU1NLFVBQVUsWUFBWTtBQUMxQixRQUFJLENBQUNULEtBQUtVLEtBQUssRUFBRztBQUNsQixVQUFNLEVBQUVOLE1BQU0sSUFBSSxNQUFNVCxTQUFTVSxLQUFLLE9BQU8sRUFBRU0sT0FBTyxDQUFDLEVBQUVYLEtBQUssQ0FBQyxDQUFDO0FBQ2hFLFFBQUlJLE9BQU87QUFDVEcsWUFBTSx3QkFBd0JILE1BQU1JLE9BQU87QUFDM0M7QUFBQSxJQUNGO0FBQ0FQLFlBQVEsRUFBRTtBQUNWQyxlQUFXO0FBQUEsRUFDYjtBQUVBWixZQUFVLE1BQU07QUFDZFksZUFBVztBQUFBLEVBQ2IsR0FBRyxFQUFFO0FBRUwsU0FDRSx1QkFBQyxTQUFJLE9BQU8sRUFBRVUsU0FBUyxJQUFJQyxZQUFZLFFBQVEsR0FDN0M7QUFBQSwyQkFBQyxRQUFHLDZCQUFKO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBaUI7QUFBQSxJQUNqQjtBQUFBLE1BQUM7QUFBQTtBQUFBLFFBQ0MsT0FBT2I7QUFBQUEsUUFDUCxVQUFVLENBQUNjLE1BQU1iLFFBQVFhLEVBQUVDLE9BQU9DLEtBQUs7QUFBQSxRQUN2QyxhQUFZO0FBQUE7QUFBQSxNQUhkO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUcrQjtBQUFBLElBRS9CLHVCQUFDLFlBQU8sU0FBU1AsU0FBUyxPQUFPLEVBQUVRLFlBQVksR0FBRyxHQUFFLG1CQUFwRDtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBRUE7QUFBQSxJQUNBLHVCQUFDLFFBQ0VuQixnQkFBTW9CO0FBQUFBLE1BQUksQ0FBQ0MsU0FDVix1QkFBQyxRQUNFQTtBQUFBQSxhQUFLQztBQUFBQSxRQUFHO0FBQUEsUUFBR0QsS0FBS25CO0FBQUFBLFdBRFZtQixLQUFLQyxJQUFkO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFFQTtBQUFBLElBQ0QsS0FMSDtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBTUE7QUFBQSxPQWhCRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBaUJBO0FBRUo7QUFBQ3ZCLEdBbERRRCxLQUFHO0FBQUF5QixLQUFIekI7QUFvRFQsZUFBZUE7QUFBSSxJQUFBeUI7QUFBQUMsYUFBQUQsSUFBQSIsIm5hbWVzIjpbInVzZUVmZmVjdCIsInVzZVN0YXRlIiwiY3JlYXRlQ2xpZW50IiwiU1VQQUJBU0VfVVJMIiwiU1VQQUJBU0VfS0VZIiwic3VwYWJhc2UiLCJBcHAiLCJfcyIsIml0ZW1zIiwic2V0SXRlbXMiLCJuYW1lIiwic2V0TmFtZSIsImZldGNoSXRlbXMiLCJkYXRhIiwiZXJyb3IiLCJmcm9tIiwic2VsZWN0IiwiYWxlcnQiLCJtZXNzYWdlIiwiYWRkSXRlbSIsInRyaW0iLCJpbnNlcnQiLCJwYWRkaW5nIiwiZm9udEZhbWlseSIsImUiLCJ0YXJnZXQiLCJ2YWx1ZSIsIm1hcmdpbkxlZnQiLCJtYXAiLCJpdGVtIiwiaWQiLCJfYyIsIiRSZWZyZXNoUmVnJCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJBcHAuanN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gXCJAc3VwYWJhc2Uvc3VwYWJhc2UtanNcIjtcblxuY29uc3QgU1VQQUJBU0VfVVJMID0gXCJodHRwczovL2Jid3ZrZXNndGFlbG95d3FrbGh0LnN1cGFiYXNlLmNvXCI7IC8vIHJlcGxhY2VcbmNvbnN0IFNVUEFCQVNFX0tFWSA9IFwiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW1KaWQzWnJaWE5uZEdGbGJHOTVkM0ZyYkdoMElpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzTmpBMk9EVTJORGtzSW1WNGNDSTZNakEzTmpJMk1UWTBPWDAudUNQQ0lUWGN2QUp2dnVNQkRQQk9pRUdRNGNWeF9YV0huNTJuVW5aWEpYQVwiOyAvLyByZXBsYWNlXG5jb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUNsaWVudChTVVBBQkFTRV9VUkwsIFNVUEFCQVNFX0tFWSk7XG5cbmZ1bmN0aW9uIEFwcCgpIHtcbiAgY29uc3QgW2l0ZW1zLCBzZXRJdGVtc10gPSB1c2VTdGF0ZShbXSk7XG4gIGNvbnN0IFtuYW1lLCBzZXROYW1lXSA9IHVzZVN0YXRlKFwiXCIpO1xuXG4gIC8vIEZldGNoIGl0ZW1zXG4gIGNvbnN0IGZldGNoSXRlbXMgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2UuZnJvbShcIml0ZW1zXCIpLnNlbGVjdChcIipcIik7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICBhbGVydChcIkVycm9yIGZldGNoaW5nIGl0ZW1zOiBcIiArIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZXRJdGVtcyhkYXRhKTtcbiAgfTtcblxuICAvLyBBZGQgaXRlbVxuICBjb25zdCBhZGRJdGVtID0gYXN5bmMgKCkgPT4ge1xuICAgIGlmICghbmFtZS50cmltKCkpIHJldHVybjtcbiAgICBjb25zdCB7IGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5mcm9tKFwiaXRlbXNcIikuaW5zZXJ0KFt7IG5hbWUgfV0pO1xuICAgIGlmIChlcnJvcikge1xuICAgICAgYWxlcnQoXCJFcnJvciBhZGRpbmcgaXRlbTogXCIgKyBlcnJvci5tZXNzYWdlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2V0TmFtZShcIlwiKTtcbiAgICBmZXRjaEl0ZW1zKCk7XG4gIH07XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBmZXRjaEl0ZW1zKCk7XG4gIH0sIFtdKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogMjAsIGZvbnRGYW1pbHk6IFwiQXJpYWxcIiB9fT5cbiAgICAgIDxoMT5TdXBhYmFzZSBEZW1vPC9oMT5cbiAgICAgIDxpbnB1dFxuICAgICAgICB2YWx1ZT17bmFtZX1cbiAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXROYW1lKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgcGxhY2Vob2xkZXI9XCJFbnRlciBpdGVtIG5hbWVcIlxuICAgICAgLz5cbiAgICAgIDxidXR0b24gb25DbGljaz17YWRkSXRlbX0gc3R5bGU9e3sgbWFyZ2luTGVmdDogMTAgfX0+XG4gICAgICAgIEFkZFxuICAgICAgPC9idXR0b24+XG4gICAgICA8dWw+XG4gICAgICAgIHtpdGVtcy5tYXAoKGl0ZW0pID0+IChcbiAgICAgICAgICA8bGkga2V5PXtpdGVtLmlkfT5cbiAgICAgICAgICAgIHtpdGVtLmlkfToge2l0ZW0ubmFtZX1cbiAgICAgICAgICA8L2xpPlxuICAgICAgICApKX1cbiAgICAgIDwvdWw+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcDtcblxuIl0sImZpbGUiOiIvVXNlcnMva2VsbHl0YW4vc3VwYWJhc2UtZGVtby9zcmMvQXBwLmpzeCJ9