function Graph(canvas, sliders, toggles) {
    // define canvas where graph will be drawn
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = Math.round(0.9 * canvas.height);
    this.ctx = this.canvas.getContext("2d");
    
    // bind sliders to the graph
    this.N = parseInt(sliders[0].value);
    this.n = parseInt(sliders[1].value);

    // on or off
    this.replacement = toggles[0].checked;
    this.order = toggles[1].checked;

    this.update_N(this.N);
    this.update_n(this.n);
    this.update_replacement(this.replacement);
    this.update_order(this.order);

    console.log(this.replacement);
    console.log(this.order);

    var that = this;
    this.bind_slider(sliders[0], function(event) {
        that.update_N(this.value);
        console.log("inside bind slider big N");
    });

    this.bind_slider(sliders[1], function(event) {
        that.update_n(this.value);
        console.log("inside bind slider little n");
    });
    // bind toggles to the graph
    // if a toggle is updated then draw out all the new possible outcomes 
    this.bind_toggle(toggles[0], function(event) {
        that.update_replacement(this.checked);
        console.log("inside bind toggle for replacement", this.checked);
    });

    this.bind_toggle(toggles[1], function(event) {
        that.update_order(this.checked);
        console.log("inside bind toggle for order", this.checked);
    });
}

Graph.prototype.enumerate_outcomes = function() {
    this.clear_canvas();

    this.ctx.font = "20px Arial";
    var string = "replacement: " + this.replacement + " order: " + this.order;
    console.log(string);
    // this.ctx.fillText(string, 10, 50); // (text, x, y)

    if (!this.replacement && !this.order) {
        this.combination();
    } else if (!this.replacement && this.order) {
        this.permutation();
    } else if (this.replacement && !this.order) {
        ;
    } else if (this.replacement && this.order) {
        ;
    } else {
        console.log("something went wrong.");
    }
}

Graph.prototype.permutation = function() {
    // https://stackoverflow.com/questions/3746725/how-to-create-an-array-containing-1-n
    var choices = Array.from(Array(this.N), (_, i) => i + 1)
    var combinations = [];
    
    // https://stackoverflow.com/questions/43241174/javascript-generating-all-combinations-of-elements-in-a-single-array-in-pairs
    const result = [];
    result.length = this.n; //n=2
    
    function combine(input, len, start) {
      if (len === 0) {
        combinations.push(result.join("")); //process here the result
        return;
      }
      for (let i = start; i <= input.length - len; i++) {
        result[result.length - len] = input[i];
        combine(input, len-1, i+1 );
      }
    }
    combine(choices, result.length, 0);
    //

    // get all the combinations, then do permute each one
    // https://initjs.org/all-permutations-of-a-set-f1be174c79f8
    function getAllPermutations(string) {
        var results = [];
      
        if (string.length === 1) {
          results.push(string);
          return results.join(" ");
        }
      
        for (var i = 0; i < string.length; i++) {
          var firstChar = string[i];
          var charsLeft = string.substring(0, i) + string.substring(i + 1);
          var innerPermutations = getAllPermutations(charsLeft);
          for (var j = 0; j < innerPermutations.length; j++) {
            results.push(firstChar + innerPermutations[j]);
          }
        }
        return results.join("");
        
    }
    //

    var permutations = []

    for (var i = 0; i < combinations.length; i++) {
        permutations.push(getAllPermutations(combinations[i]));
        console.log(combinations[i]);
    }

    // console.log("start");
    // for (var i = 0; i < permutations.length; i++) {
    //     this.ctx.fillText(permutations[i], 10, 50 + i*30); // (text, x, y)
    //     console.log(permutations[i]);
    // }
    // console.log("end");
}

Graph.prototype.combination = function() {
    // https://stackoverflow.com/questions/3746725/how-to-create-an-array-containing-1-n
    var choices = Array.from(Array(this.N), (_, i) => i + 1)
    var combinations = [];
    
    // https://stackoverflow.com/questions/43241174/javascript-generating-all-combinations-of-elements-in-a-single-array-in-pairs
    const result = [];
    result.length = this.n; //n=2
    
    function combine(input, len, start) {
      if (len === 0) {
        combinations.push(result.join("")); //process here the result
        return;
      }
      for (let i = start; i <= input.length - len; i++) {
        result[result.length - len] = input[i];
        combine(input, len-1, i+1 );
      }
    }
    combine(choices, result.length, 0);
    //

    for (var i = 0; i < combinations.length; i++) {
        this.ctx.fillText(combinations[i], 10, 50 + i*30); // (text, x, y)
    }
}

// event handler when n changes
Graph.prototype.update_N = function(N) {
    this.N = parseInt(N);
    this.enumerate_outcomes();
    
    document.querySelector("#bigN").innerHTML = this.N;
}

// event handler when p changes
Graph.prototype.update_n = function(n) {
    this.n = parseFloat(n);
    this.enumerate_outcomes();

    document.querySelector("#n").innerHTML = this.n;
}

Graph.prototype.update_replacement = function(checkbox) {
    this.replacement = checkbox;
    // redraw possible outcomes here
    this.enumerate_outcomes();
}

Graph.prototype.update_order = function(checkbox) {
    this.order = checkbox;
    // redraw possible outcomes here
    this.enumerate_outcomes();
}

// bind an event handler to the slider
Graph.prototype.bind_slider = function(slider, handler) {
    slider.oninput = handler;
}

// bind an event handler to the toggle
Graph.prototype.bind_toggle = function(toggle, handler) {
    toggle.onclick = handler;
}

// clear entire canvas
Graph.prototype.clear_canvas = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

// initialize graph when page loads
document.addEventListener("DOMContentLoaded", function(event) {
    var graph = new Graph(
	document.querySelector("#graph"),
    document.querySelectorAll("input[type='range']"),
    document.querySelectorAll("input[type='checkbox']")
    );
});