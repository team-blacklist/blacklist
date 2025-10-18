import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/App.jsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=9ab75c19"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=9ab75c19"; const useState = __vite__cjsImport1_react["useState"]; const useEffect = __vite__cjsImport1_react["useEffect"];
import { createClient } from "/node_modules/.vite/deps/@supabase_supabase-js.js?v=9ab75c19";
const SUPABASE_URL = "https://jhopkgnjxaielptfbntb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impob3BrZ25qeGFpZWxwdGZibnRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDkxOTksImV4cCI6MjA3NjEyNTE5OX0.j0JZrIt_9rM5tZkSyGcun-Jp2QMKOysSzNfMEMomzBs";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
function App() {
  _s();
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchTodos();
  }, []);
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const { data, error: error2 } = await supabase.from("todos").select("*").order("created_at", { ascending: false });
      if (error2) throw error2;
      setTodos(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching todos:", err);
    } finally {
      setLoading(false);
    }
  };
  const addTodo = async () => {
    if (!newTask.trim()) return;
    try {
      const { data, error: error2 } = await supabase.from("todos").insert([{ task: newTask, is_complete: false }]).select();
      if (error2) throw error2;
      setTodos([data[0], ...todos]);
      setNewTask("");
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error adding todo:", err);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };
  const toggleComplete = async (id, currentStatus) => {
    try {
      const { error: error2 } = await supabase.from("todos").update({ is_complete: !currentStatus }).eq("id", id);
      if (error2) throw error2;
      setTodos(todos.map(
        (todo) => todo.id === id ? { ...todo, is_complete: !currentStatus } : todo
      ));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error updating todo:", err);
    }
  };
  const deleteTodo = async (id) => {
    try {
      const { error: error2 } = await supabase.from("todos").delete().eq("id", id);
      if (error2) throw error2;
      setTodos(todos.filter((todo) => todo.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error deleting todo:", err);
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4", children: /* @__PURE__ */ jsxDEV("div", { className: "w-full max-w-2xl bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center", children: [
    /* @__PURE__ */ jsxDEV("h1", { className: "text-4xl font-bold text-indigo-900 mb-8", children: "To-do List" }, void 0, false, {
      fileName: "/Users/yq/yq-sample-web/src/App.jsx",
      lineNumber: 100,
      columnNumber: 9
    }, this),
    error && /* @__PURE__ */ jsxDEV("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mx-auto max-w-md", children: error }, void 0, false, {
      fileName: "/Users/yq/yq-sample-web/src/App.jsx",
      lineNumber: 106,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "mb-8 flex justify-center", children: /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2 w-full max-w-md", children: [
      /* @__PURE__ */ jsxDEV(
        "input",
        {
          type: "text",
          value: newTask,
          onChange: (e) => setNewTask(e.target.value),
          onKeyPress: handleKeyPress,
          placeholder: "Add a new task...",
          className: "flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        },
        void 0,
        false,
        {
          fileName: "/Users/yq/yq-sample-web/src/App.jsx",
          lineNumber: 114,
          columnNumber: 13
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: addTodo,
          className: "px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium",
          children: "Add"
        },
        void 0,
        false,
        {
          fileName: "/Users/yq/yq-sample-web/src/App.jsx",
          lineNumber: 122,
          columnNumber: 13
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/Users/yq/yq-sample-web/src/App.jsx",
      lineNumber: 113,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/Users/yq/yq-sample-web/src/App.jsx",
      lineNumber: 112,
      columnNumber: 9
    }, this),
    loading ? /* @__PURE__ */ jsxDEV("div", { className: "text-center py-8 text-gray-600", children: "Loading todos..." }, void 0, false, {
      fileName: "/Users/yq/yq-sample-web/src/App.jsx",
      lineNumber: 133,
      columnNumber: 9
    }, this) : todos.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "text-center py-8 text-gray-600", children: "No todos yet. Add one above to get started!" }, void 0, false, {
      fileName: "/Users/yq/yq-sample-web/src/App.jsx",
      lineNumber: 135,
      columnNumber: 9
    }, this) : /* @__PURE__ */ jsxDEV("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxDEV("div", { className: "w-full max-w-md space-y-2", children: todos.map(
      (todo) => /* @__PURE__ */ jsxDEV(
        "div",
        {
          className: "bg-white rounded-lg shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-shadow",
          children: [
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "checkbox",
                checked: todo.is_complete,
                onChange: () => toggleComplete(todo.id, todo.is_complete),
                className: "w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              },
              void 0,
              false,
              {
                fileName: "/Users/yq/yq-sample-web/src/App.jsx",
                lineNumber: 146,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "span",
              {
                className: `flex-1 text-left ${todo.is_complete ? "line-through text-gray-400" : "text-gray-800"}`,
                children: todo.task
              },
              void 0,
              false,
              {
                fileName: "/Users/yq/yq-sample-web/src/App.jsx",
                lineNumber: 152,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => deleteTodo(todo.id),
                className: "px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors",
                children: "Delete"
              },
              void 0,
              false,
              {
                fileName: "/Users/yq/yq-sample-web/src/App.jsx",
                lineNumber: 161,
                columnNumber: 19
              },
              this
            )
          ]
        },
        todo.id,
        true,
        {
          fileName: "/Users/yq/yq-sample-web/src/App.jsx",
          lineNumber: 142,
          columnNumber: 13
        },
        this
      )
    ) }, void 0, false, {
      fileName: "/Users/yq/yq-sample-web/src/App.jsx",
      lineNumber: 140,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "/Users/yq/yq-sample-web/src/App.jsx",
      lineNumber: 139,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "mt-8 text-center text-gray-600 text-sm", children: [
      todos.filter((t) => !t.is_complete).length,
      " active tasks"
    ] }, void 0, true, {
      fileName: "/Users/yq/yq-sample-web/src/App.jsx",
      lineNumber: 174,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/Users/yq/yq-sample-web/src/App.jsx",
    lineNumber: 98,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/Users/yq/yq-sample-web/src/App.jsx",
    lineNumber: 97,
    columnNumber: 5
  }, this);
}
_s(App, "N+yDa52/lmOgmErsqEAkHUof7ik=");
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
    RefreshRuntime.registerExportsForReactRefresh("/Users/yq/yq-sample-web/src/App.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/Users/yq/yq-sample-web/src/App.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "/Users/yq/yq-sample-web/src/App.jsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,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RWpCLFdBQVcsRUFBRWdCO0FBQUFBLE1BQU87QUFBQSxTQUQ1QztBQUFBO0FBQUE7QUFBQTtBQUFBLFdBRUE7QUFBQSxPQTlFRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBK0VBLEtBaEZGO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FpRkE7QUFFSjtBQUFDdEMsR0E1S1FELEtBQUc7QUFBQXlDLEtBQUh6QztBQThLVCxlQUFlQTtBQUFJLElBQUF5QztBQUFBQyxhQUFBRCxJQUFBIiwibmFtZXMiOlsidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJjcmVhdGVDbGllbnQiLCJTVVBBQkFTRV9VUkwiLCJTVVBBQkFTRV9LRVkiLCJzdXBhYmFzZSIsIkFwcCIsIl9zIiwidG9kb3MiLCJzZXRUb2RvcyIsIm5ld1Rhc2siLCJzZXROZXdUYXNrIiwibG9hZGluZyIsInNldExvYWRpbmciLCJlcnJvciIsInNldEVycm9yIiwiZmV0Y2hUb2RvcyIsImRhdGEiLCJmcm9tIiwic2VsZWN0Iiwib3JkZXIiLCJhc2NlbmRpbmciLCJlcnIiLCJtZXNzYWdlIiwiY29uc29sZSIsImFkZFRvZG8iLCJ0cmltIiwiaW5zZXJ0IiwidGFzayIsImlzX2NvbXBsZXRlIiwiaGFuZGxlS2V5UHJlc3MiLCJlIiwia2V5IiwidG9nZ2xlQ29tcGxldGUiLCJpZCIsImN1cnJlbnRTdGF0dXMiLCJ1cGRhdGUiLCJlcSIsIm1hcCIsInRvZG8iLCJkZWxldGVUb2RvIiwiZGVsZXRlIiwiZmlsdGVyIiwidGFyZ2V0IiwidmFsdWUiLCJsZW5ndGgiLCJ0IiwiX2MiLCIkUmVmcmVzaFJlZyQiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsiQXBwLmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSBcIkBzdXBhYmFzZS9zdXBhYmFzZS1qc1wiO1xuXG5jb25zdCBTVVBBQkFTRV9VUkwgPSBcImh0dHBzOi8vamhvcGtnbmp4YWllbHB0ZmJudGIuc3VwYWJhc2UuY29cIjtcbmNvbnN0IFNVUEFCQVNFX0tFWSA9IFwiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW1wb2IzQnJaMjVxZUdGcFpXeHdkR1ppYm5SaUlpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzTmpBMU5Ea3hPVGtzSW1WNGNDSTZNakEzTmpFeU5URTVPWDAuajBKWnJJdF85ck01dFprU3lHY3VuLUpwMlFNS095c1N6TmZNRU1vbXpCc1wiO1xuY29uc3Qgc3VwYWJhc2UgPSBjcmVhdGVDbGllbnQoU1VQQUJBU0VfVVJMLCBTVVBBQkFTRV9LRVkpO1xuXG5mdW5jdGlvbiBBcHAoKSB7XG4gIGNvbnN0IFt0b2Rvcywgc2V0VG9kb3NdID0gdXNlU3RhdGUoW10pO1xuICBjb25zdCBbbmV3VGFzaywgc2V0TmV3VGFza10gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKG51bGwpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgZmV0Y2hUb2RvcygpO1xuICB9LCBbXSk7XG5cbiAgY29uc3QgZmV0Y2hUb2RvcyA9IGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgc2V0TG9hZGluZyh0cnVlKTtcbiAgICAgIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG4gICAgICAgIC5mcm9tKCd0b2RvcycpXG4gICAgICAgIC5zZWxlY3QoJyonKVxuICAgICAgICAub3JkZXIoJ2NyZWF0ZWRfYXQnLCB7IGFzY2VuZGluZzogZmFsc2UgfSk7XG5cbiAgICAgIGlmIChlcnJvcikgdGhyb3cgZXJyb3I7XG4gICAgICBzZXRUb2RvcyhkYXRhIHx8IFtdKTtcbiAgICAgIHNldEVycm9yKG51bGwpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc2V0RXJyb3IoZXJyLm1lc3NhZ2UpO1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgdG9kb3M6JywgZXJyKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGFkZFRvZG8gPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKCFuZXdUYXNrLnRyaW0oKSkgcmV0dXJuO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG4gICAgICAgIC5mcm9tKCd0b2RvcycpXG4gICAgICAgIC5pbnNlcnQoW3sgdGFzazogbmV3VGFzaywgaXNfY29tcGxldGU6IGZhbHNlIH1dKVxuICAgICAgICAuc2VsZWN0KCk7XG5cbiAgICAgIGlmIChlcnJvcikgdGhyb3cgZXJyb3I7XG4gICAgICBzZXRUb2RvcyhbZGF0YVswXSwgLi4udG9kb3NdKTtcbiAgICAgIHNldE5ld1Rhc2soJycpO1xuICAgICAgc2V0RXJyb3IobnVsbCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzZXRFcnJvcihlcnIubWVzc2FnZSk7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBhZGRpbmcgdG9kbzonLCBlcnIpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVLZXlQcmVzcyA9IChlKSA9PiB7XG4gICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB7XG4gICAgICBhZGRUb2RvKCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHRvZ2dsZUNvbXBsZXRlID0gYXN5bmMgKGlkLCBjdXJyZW50U3RhdHVzKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG4gICAgICAgIC5mcm9tKCd0b2RvcycpXG4gICAgICAgIC51cGRhdGUoeyBpc19jb21wbGV0ZTogIWN1cnJlbnRTdGF0dXMgfSlcbiAgICAgICAgLmVxKCdpZCcsIGlkKTtcblxuICAgICAgaWYgKGVycm9yKSB0aHJvdyBlcnJvcjtcbiAgICAgIHNldFRvZG9zKHRvZG9zLm1hcCh0b2RvID0+IFxuICAgICAgICB0b2RvLmlkID09PSBpZCA/IHsgLi4udG9kbywgaXNfY29tcGxldGU6ICFjdXJyZW50U3RhdHVzIH0gOiB0b2RvXG4gICAgICApKTtcbiAgICAgIHNldEVycm9yKG51bGwpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc2V0RXJyb3IoZXJyLm1lc3NhZ2UpO1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgdXBkYXRpbmcgdG9kbzonLCBlcnIpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBkZWxldGVUb2RvID0gYXN5bmMgKGlkKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG4gICAgICAgIC5mcm9tKCd0b2RvcycpXG4gICAgICAgIC5kZWxldGUoKVxuICAgICAgICAuZXEoJ2lkJywgaWQpO1xuXG4gICAgICBpZiAoZXJyb3IpIHRocm93IGVycm9yO1xuICAgICAgc2V0VG9kb3ModG9kb3MuZmlsdGVyKHRvZG8gPT4gdG9kby5pZCAhPT0gaWQpKTtcbiAgICAgIHNldEVycm9yKG51bGwpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc2V0RXJyb3IoZXJyLm1lc3NhZ2UpO1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZGVsZXRpbmcgdG9kbzonLCBlcnIpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwibWluLWgtc2NyZWVuIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGJnLWdyYWRpZW50LXRvLWJyIGZyb20tYmx1ZS01MCB0by1pbmRpZ28tMTAwIHB4LTRcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1mdWxsIG1heC13LTJ4bCBiZy13aGl0ZS82MCBiYWNrZHJvcC1ibHVyLW1kIHJvdW5kZWQtMnhsIHNoYWRvdy1sZyBwLTggdGV4dC1jZW50ZXJcIj5cbiAgICAgICAgey8qIENlbnRlcmVkIFRpdGxlICovfVxuICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC00eGwgZm9udC1ib2xkIHRleHQtaW5kaWdvLTkwMCBtYi04XCI+XG4gICAgICAgICAgVG8tZG8gTGlzdFxuICAgICAgICA8L2gxPlxuXG4gICAgICAgIHsvKiBDZW50ZXJlZCBFcnJvciBNZXNzYWdlICovfVxuICAgICAgICB7ZXJyb3IgJiYgKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctcmVkLTEwMCBib3JkZXIgYm9yZGVyLXJlZC00MDAgdGV4dC1yZWQtNzAwIHB4LTQgcHktMyByb3VuZGVkIG1iLTQgbXgtYXV0byBtYXgtdy1tZFwiPlxuICAgICAgICAgICAge2Vycm9yfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuXG4gICAgICAgIHsvKiBDZW50ZXJlZCBJbnB1dCBTZWN0aW9uICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTggZmxleCBqdXN0aWZ5LWNlbnRlclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBnYXAtMiB3LWZ1bGwgbWF4LXctbWRcIj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgIHZhbHVlPXtuZXdUYXNrfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldE5ld1Rhc2soZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBvbktleVByZXNzPXtoYW5kbGVLZXlQcmVzc31cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJBZGQgYSBuZXcgdGFzay4uLlwiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXgtMSBweC00IHB5LTMgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWdyYXktMzAwIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1pbmRpZ28tNTAwXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2FkZFRvZG99XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTYgcHktMyBiZy1pbmRpZ28tNjAwIHRleHQtd2hpdGUgcm91bmRlZC1sZyBob3ZlcjpiZy1pbmRpZ28tNzAwIHRyYW5zaXRpb24tY29sb3JzIGZvbnQtbWVkaXVtXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgQWRkXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgey8qIENlbnRlcmVkIENvbnRlbnQgKi99XG4gICAgICAgIHtsb2FkaW5nID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXIgcHktOCB0ZXh0LWdyYXktNjAwXCI+TG9hZGluZyB0b2Rvcy4uLjwvZGl2PlxuICAgICAgICApIDogdG9kb3MubGVuZ3RoID09PSAwID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXIgcHktOCB0ZXh0LWdyYXktNjAwXCI+XG4gICAgICAgICAgICBObyB0b2RvcyB5ZXQuIEFkZCBvbmUgYWJvdmUgdG8gZ2V0IHN0YXJ0ZWQhXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktY2VudGVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctZnVsbCBtYXgtdy1tZCBzcGFjZS15LTJcIj5cbiAgICAgICAgICAgICAge3RvZG9zLm1hcCgodG9kbykgPT4gKFxuICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgIGtleT17dG9kby5pZH1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJnLXdoaXRlIHJvdW5kZWQtbGcgc2hhZG93LXNtIHAtNCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMyBob3ZlcjpzaGFkb3ctbWQgdHJhbnNpdGlvbi1zaGFkb3dcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgICAgICAgICBjaGVja2VkPXt0b2RvLmlzX2NvbXBsZXRlfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KCkgPT4gdG9nZ2xlQ29tcGxldGUodG9kby5pZCwgdG9kby5pc19jb21wbGV0ZSl9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctNSBoLTUgdGV4dC1pbmRpZ28tNjAwIHJvdW5kZWQgZm9jdXM6cmluZy0yIGZvY3VzOnJpbmctaW5kaWdvLTUwMCBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgZmxleC0xIHRleHQtbGVmdCAke1xuICAgICAgICAgICAgICAgICAgICAgIHRvZG8uaXNfY29tcGxldGVcbiAgICAgICAgICAgICAgICAgICAgICAgID8gJ2xpbmUtdGhyb3VnaCB0ZXh0LWdyYXktNDAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgOiAndGV4dC1ncmF5LTgwMCdcbiAgICAgICAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHt0b2RvLnRhc2t9XG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGRlbGV0ZVRvZG8odG9kby5pZCl9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTMgcHktMSB0ZXh0LXJlZC02MDAgaG92ZXI6YmctcmVkLTUwIHJvdW5kZWQgdHJhbnNpdGlvbi1jb2xvcnNcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICBEZWxldGVcbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuXG4gICAgICAgIHsvKiBDZW50ZXJlZCBGb290ZXIgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtOCB0ZXh0LWNlbnRlciB0ZXh0LWdyYXktNjAwIHRleHQtc21cIj5cbiAgICAgICAgICB7dG9kb3MuZmlsdGVyKHQgPT4gIXQuaXNfY29tcGxldGUpLmxlbmd0aH0gYWN0aXZlIHRhc2tzXG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcDsiXSwiZmlsZSI6Ii9Vc2Vycy95cS95cS1zYW1wbGUtd2ViL3NyYy9BcHAuanN4In0=