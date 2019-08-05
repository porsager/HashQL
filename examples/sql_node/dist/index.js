(function () {
  'use strict';

  function Query(name, hql, args) {
    this.name = name;
    this.hql = hql;
    this.args = args.map(x => {
      if (!x || !(x.query instanceof Query))
        return { value: x }

      x.cancelled = true;
      return { query: x.query }
    });
  }

  function HashQL(name, method) {
    return function hql(x, ...args) {
      const promise = Promise.resolve().then(() => {
        if (promise.cancelled)
          return
        const result = method(promise.query);
        promise.query = null;
        return Promise.resolve(result)
      });

      promise.query = new Query(name, x, args);

      return promise
    }
  }

  const pre = document.createElement("pre");
  const ui = {};

  ui.name = document.body.appendChild(Object.assign(document.createElement("input"), {
      oninput: search
  }));

  ui.columns = document.body.appendChild(Object.assign(document.createElement("input"), {
      value: "name",
      oninput: search
  }));

  document.body.appendChild(pre);

  const req = x => {
      return fetch("http://localhost:8000", {
          method: "POST",

          headers: {
              "Content-Type": "JSON"
          },

          body: JSON.stringify(x)
      }).then(r => r.json());
  };

  const sql = HashQL("sql", req);
  const node = HashQL("node", req);

  function search() {
      sql(
          "663792fa34c55ea051c690a0a33e40cd",
          ui.columns.value.split(","),
          node("05ee39c67f7041e69d249e31d92795fb", ui.name.value)
      ).then(x => {
          pre.textContent = JSON.stringify(x, null, 2);
      });
  }

}());
