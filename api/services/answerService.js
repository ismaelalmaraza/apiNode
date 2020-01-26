// const Answer = require("./Answer");

class El {
  constructor() {
    this.analythics;
  }

  /******************
   *			Rating		*
   ******************/

  setRating(data) {
    this.analythics = {
      rateMin: data.hasOwnProperty("rateMin") ? data.rateMin : 1,
      rateMax: data.hasOwnProperty("rateMax") ? data.rateMax : 5
    };

    this.analythics.values = new Array(this.analythics.rateMax + 1).fill(-1);
    this.analythics.values.fill(0, this.analythics.rateMin);
  }

  rating(data) {
    if (this.analythics) {
      let value = data.Answer;
      this.analythics.values[value] += 1;
    } else {
      this.setRating(data);
    }
  }

  /***********
   * checkbox *
   ***********/
  setCheckbox(data) {
    let { choices } = data;
    this.analythics = {
      keys: choices.map(choice => choice.text),
      other: 0
    };

    var sizeArray = choices.length;
    if (data.hasOwnProperty("hasOther")) {
      this.analythics.keys.push("Otro");
      sizeArray++;
    }
    this.analythics.values = new Array(sizeArray).fill(0);
  }

  checkbox(data) {
    try {
      if (!this.analythics) {
        this.setCheckbox(data);
      } else {
        let { choices, Answer } = data;
        var band = false;
        if (Answer) {
          try {
            if (typeof Answer === "string") {
              answer = JSON.parse(Answer);
            }
          } catch (error) {}

          let answer = Answer;
          if (typeof answer === "boolean") {
            answer = answer.toString();
          }

          choices.map(choice => {
            if (answer.includes(choice.value)) {
              let position = this.analythics.keys.indexOf(choice.text);
              this.analythics.values[position] += 1;
              band = true;
            }
          });
        }

        if (!band && Answer && data.hasOwnProperty("hasOther")) {
          this.analythics.values[this.analythics.values.length - 1] += 1;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  radiogroup(data) {
    // Tanto radiogroup como checkbox actuan y contienen infromacion similar
    this.checkbox(data);
  }

  dropdown(data) {
    this.checkbox(data);
  }

  text(data) {
    this.comment(data);
  }

  comment(data) {
    if (!this.analythics) {
      this.analythics = [];
    } else {
      const { Answer } = data;
      this.analythics.push(Answer);
    }
  }

  /**********
   * MATRIX *
   **********/
  setMatrix(data) {
    let { rows, columns } = data;
    this.analythics = {
      rows: rows.map(r => r.text),
      columns:
        typeof columns[0] === "string" ? columns : columns.map(c => c.text)
    };

    rows.forEach(r => {
      this.analythics[r.text] = new Array(this.analythics.columns.length).fill(
        0
      );
    });
  }
  matrix(data) {
    // console.log(data);
    if (!this.analythics) {
      this.setMatrix(data);
    } else {
      let { rows, columns, Answer } = data;

      let values = {};
      // Crea relacion entre preguna y respuesta
      Answer = typeof Answer === "string" ? JSON.parse(Answer) : Answer;
      for (let a in Answer) {
        let c = columns.find(obj => {
          if (obj instanceof Object) {
            return Answer[a] === obj.value;
          } else {
            return Answer[a] === obj;
          }
        });

        let r = rows.find(obj => a === obj.value);

        values[r.text] = c && c.text ? c.text : c;
      }

      // Obtiene puntaje por tipo
      for (let i in values) {
        let postition = this.analythics.columns.indexOf(values[i]);
        this.analythics[i][postition] += 1;
      }
    }
  }

  /****************
   * multipletext *
   ***************/
  // TODO: añadir 'items' al modelo para ser almacenado
  setMultipletext(data) {
    let { items } = data;
    this.analythics = {
      rows: items.map(i => i.title)
    };

    items.forEach(i => {
      this.analythics[i.title] = [];
    });
  }

  multipletext(data) {
    if (!this.analythics) {
      this.setMultipletext(data);
    } else {
      let { items, Answer } = data;
      Answer = typeof Answer === "string" ? JSON.parse(Answer) : Answer;

      items.forEach((item, i) => {
        if (item.name === Answer[i].name) {
          this.analythics[item.title].push(Answer[i].Answer);
        }
      });
    }
  }

  /***************
   * imagepicker *
   ***************/

  setImagepicker(data) {
    let { choices } = data;
    this.analythics = { choices, empty: [] };
    choices.forEach(c => {
      this.analythics[c] = [];
    });
    this.analythics.item1 = [];
  }

  imagepicker(data) {
    if (!this.analythics) {
      this.setImagepicker(data);
    } else {
      let { Answer } = data;

      Answer = typeof Answer === "string" ? JSON.parse(Answer) : Answer;

      if (Answer !== null) {
        Answer.forEach(a => {
          this.analythics[a.text ? a.text : "item1"].push(a.fileName);
        });
      } else {
        this.analythics.empty.push(null);
      }
    }
  }

  setSignaturepad() {
    this.analythics = [];
  }

  signaturepad(data) {
    if (!this.analythics) {
      this.setSignaturepad(data);
    } else {
      let { Answer } = data;

      this.analythics.push(Answer);
    }
  }

  setBoolean(data) {
    this.analythics = [];
  }

  boolean(data) {
    if (!this.analythics) {
      this.setBoolean(data);
    } else {
      let { Answer } = data;
      this.analythics.push(Answer);
    }
  }

  setAnalytics() {
    this.analythics = null;
  }
}

module.exports = El;
