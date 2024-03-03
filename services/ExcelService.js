const { Schema } = require("@formily/react");
const XLSX = require("xlsx");

class ExcelService {
  allHeaders = [];
  extractedData = [];
  data = [];
  schema = {};

  sortId = 0;

  constructor(schema, data) {
    this.schema = schema;
    this.data = data;

    let sch = new Schema(this.schema);
    let cc = [];

    let excludeComponents = [
      "ArrayCards.Remove",
      "ArrayCards.MoveDown",
      "ArrayCards.MoveUp",
      "ArrayCards.Addition",

      "ArrayTable.Index",
      "ArrayTable.Column",
      "ArrayTable.Remove",
      "ArrayTable.MoveDown",
      "ArrayTable.MoveUp",
      "ArrayTable.Addition",
      "FormLayout",
      "FormCollapse",
    ];

    let maxx = (s, enumItem, title = "") => {
      s.mapProperties((p) => {
        if (p["x-component"] === "ArrayTable.Column") {
          title = p["x-component-props"]?.title;
        }

        // if (enumItem?.[p?.title] || p.title || title) {
        if (!excludeComponents.includes(p["x-component"])) {
          let obj = {
            "x-component": p["x-component"],
            title: enumItem?.[p?.title] || p.title,
            parentTitle: title,
            "x-designable-id": p.name ?? p["x-designable-id"],
          };
          cc.push(obj);
        }
        // }

        if (p.properties) {
          maxx(p, enumItem, title);
        }

        if (
          p["x-component"] === "ArrayCards" ||
          p["x-component"] === "ArrayTable"
        ) {
          if (p?.enum?.length) {
            p.enum.forEach((element) => {
              if (typeof p.items === "object") {
                maxx(p.items, element, title);
              }
            });
          } else if (typeof p.items === "object") {
            maxx(p.items, enumItem, title);
          }
        }
      });
    };
    maxx(sch);
    // dd(cc);
    let pp = cc.reduce((r, c) => {
      r[c["x-designable-id"]] = c.title || c.parentTitle;
      return r;
    }, {});
    let ids = cc.reduce((r, c, i) => {
      r[c["x-designable-id"]] = i;
      return r;
    }, {});
    // dd(ids);
    const that = this;
    function flattenObject(obj, parentKey = "", result = {}, id = null) {
      for (const key in obj) {
        let propName = "";
        if (pp[key]) {
          propName = parentKey ? `${parentKey} # ${pp[key]}` : pp[key];
        }

        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
          flattenObject(obj[key], propName, result);
        } else if (Array.isArray(obj[key])) {
          let sid = id || ids[key];
          obj[key].forEach((arrayItem, i) => {
            // dd(obj[key]);
            // dd(arrayItem);
            flattenObject(
              arrayItem,
              `${parentKey}${arrayItem?.title || ""} ${i + 1}${propName}`,
              result,
              sid + "." + (i + 1)
            );
          });
        }
        let num = propName.split("#")?.[0]?.trim();
        if (propName) {
          that.allHeaders.push({
            header: propName.replaceAll("\n", ""),
            // sortId: !isNaN(num) ? parseFloat(ids[key] + "." + num) : ids[key],
            sortId: id ? id : ids[key],
            key,
          });
          result[propName.replaceAll("\n", "")] = obj[key];
        }
      }
      return result;
    }

    this.extractedData = this.data.map(({ data }) => {
      // dd(data)
      return flattenObject(data);
    });

    // dd(this.extractedData);
  }

  get uniqueHeaders() {
    return this.allHeaders
      .filter(
        (obj, index, array) =>
          index === array.findIndex((item) => item.header === obj.header)
      )
      .sort((a, b) => a.sortId - b.sortId)
      .map((item) => item.header.replaceAll("\n", ""));
  }

  // Generate Excel file
  generateExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.extractedData, {
      header: this.uniqueHeaders,
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${"submissions"}.${"xlsx"}`);
  }
}

export default ExcelService;
