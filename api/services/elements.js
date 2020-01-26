// const Answer = require("./answer");

class Elements {
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
      let value = data.answer;
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
      keys: choices.map(choice => choice.text)
    };
    this.analythics.values = new Array(choices.length).fill(0);
  }

  checkbox(data) {
    try {
      if (!this.analythics) {
        this.setCheckbox(data);
      } else {
        let { choices, answer } = data;
        choices.map(choice => {
          if (answer.includes(choice.value)) {
            let position = this.analythics.keys.indexOf(choice.text);
            this.analythics.values[position] += 1;
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  // TODO: Tratar tema cuando se tenga la opcion 'otro'
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
      const { answer } = data;
      this.analythics.push(answer);
    }
  }

  /**********
   * MATRIX *
   **********/
  setMatrix(data) {
    let { rows, columns } = data;
    this.analythics = {
      rows: rows.map(r => r.text),
      columns: columns.map(c => c.text)
    };

    rows.forEach(r => {
      this.analythics[r.text] = new Array(this.analythics.rows.length).fill(0);
    });

    // this.analythics.arrayRows = new Array(this.analythics.rows.length).fill(0);

    // console.log(JSON.stringify(this.analythics, null, 4));
  }
  matrix(data) {
    if (!this.analythics) {
      this.setMatrix(data);
    } else {
      let { rows, columns, answer } = data._doc;

      let values = {};
      // Crea relacion entre preguna y respuesta
      for (let a in answer) {
        let c = columns.find(obj => answer[a] === obj.value);
        let r = rows.find(obj => a === obj.value);
        values[r.text] = c.text;
      }

      // Obtiene puntaje por tipo
      for (let i in values) {
        let postition = this.analythics.columns.indexOf(values[i]);
        this.analythics[i][postition] += 1;
      }

      // console.log(this.analythics);
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
      let { items, answer } = data._doc;
      items.forEach((item, i) => {
        if (item.name === answer[i].name) {
          this.analythics[item.title].push(answer[i].Answer);
        }
      });
    }
  }

  /***************
   * imagepicker *
   ***************/

  setImagepicker(data) {
    let { choices } = data;
    this.analythics = { choices };
    choices.forEach(c => {
      this.analythics[c] = [];
    });
  }

  imagepicker(data) {
    if (!this.analythics) {
      this.setImagepicker(data);
    } else {
      let { answer } = data;
      answer.forEach(a => {
        this.analythics[a.text].push(a.fileName);
      });
    }
  }

  setAnalytics() {
    this.analythics = null;
  }
}

module.exports = Elements;
