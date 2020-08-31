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

    var that = this;
    this.bind_slider(sliders[0], function(event) {
        that.update_N(this.value);
    });

    this.bind_slider(sliders[1], function(event) {
        that.update_n(this.value);
    });
    // bind toggles to the graph
    // if a toggle is updated then draw out all the new possible outcomes 
    this.bind_toggle(toggles[0], function(event) {
        that.update_replacement(this.checked);
    });

    this.bind_toggle(toggles[1], function(event) {
        that.update_order(this.checked);
    });
}

Graph.prototype.enumerate_outcomes = function() {
    this.clear_canvas();
    // reset canvas dimensions
    this.canvas.width = 750;
    this.canvas.height = 450;

    this.ctx.font = "20px Arial";
    var string = "replacement: " + this.replacement + " order: " + this.order;
    // this.ctx.fillText(string, 10, 50); // (text, x, y)

    if (!this.replacement && !this.order) {
        this.combination();
    } else if (!this.replacement && this.order) {
        this.permutation();
    } else if (this.replacement && !this.order) {
        this.combinationsWithReplacement();
    } else if (this.replacement && this.order) {
        this.permutationsWithReplacement();
    } else {
        console.log("something went wrong.");
    }
}

Graph.prototype.combinationsWithReplacement = function() {
    var arr = Array.from(Array(this.N), (_, i) => i + 1);
    var l = this.n;

    // https://stackoverflow.com/questions/32543936/combination-with-repetition
    if(l === void 0) l = arr.length; // Length of the combinations
    var data = Array(l),             // Used to store state
        results = [];                // Array of results
    (function f(pos, start) {        // Recursive function
        if(pos === l) {                // End reached
        results.push(data.slice().join(""));  // Add a copy of data to results
        return;
        }
        for(var i=start; i<arr.length; ++i) {
        data[pos] = arr[i];          // Update data
        f(pos+1, i);                 // Call f recursively
        }
    })(0, 0);                        // Start at index 0

    // for (let i = 0; i < results.length; i++) { // print 10 numbers per line
    //     this.ctx.fillText(results[i], 10, 50 + i*30); // (text, x, y)
    // }

    this.adjustCanvasSize(results);
    for (var i = 0; i < results.length; i++) {
        console.log(results[i][0]);
        for (var j = 0; j < results[i].length; j++) {
            this.ctx.fillText(results[i][j], 10 + j*60, 50 + i*30);
        }
    }
}

Graph.prototype.permutationsWithReplacement = function() {
    var arr = Array.from(Array(this.N), (_, i) => i + 1);
    var l = this.n;

    // https://stackoverflow.com/questions/32543936/combination-with-repetition
    if(l === void 0) l = arr.length; // Length of the combinations
    var data = Array(l),             // Used to store state
        results = [];                // Array of results
    (function f(pos, start) {        // Recursive function
        if(pos === l) {                // End reached
        results.push(data.slice().join(""));  // Add a copy of data to results
        return;
        }
        for(var i=start; i<arr.length; ++i) {
        data[pos] = arr[i];          // Update data
        f(pos+1, i);                 // Call f recursively
        }
    })(0, 0);                        // Start at index 0

    function getAllPermutations(string) {
        var results = [];
      
        if (string.length === 1) {
          results.push(string);
          return results;
        }
      
        for (var i = 0; i < string.length; i++) {
          var firstChar = string[i];
          var charsLeft = string.substring(0, i) + string.substring(i + 1);
          var innerPermutations = getAllPermutations(charsLeft);
          for (var j = 0; j < innerPermutations.length; j++) {
            results.push(firstChar + innerPermutations[j]);
          }
        }
        return results;
    }

    var permutations = [];
    var all_permutations = [];
    var new_permutations = [];
    len = results.length;

    for (var i = 0; i < len; i++) {
        permutations = getAllPermutations(results[i]); // list strings of permutations
        new_permutations.push(results[i])
        for (var t = 0; t < permutations.length; t++) {
            if (!results.includes(permutations[t])) {
                results.push(permutations[t])
                new_permutations.push(permutations[t])
            }
        }
        all_permutations.push(new_permutations);
        new_permutations = [];
    }

    this.adjustCanvasSize(all_permutations);
    for (var i = 0; i < all_permutations.length; i++) {
        console.log(all_permutations[i][0]);
        for (var j = 0; j < all_permutations[i].length; j++) {
            this.ctx.fillText(all_permutations[i][j], 10 + j*60, 50 + i*30);
        }
        // this.ctx.fillText(all_permutations[i].join(" "), 10, 50 + i*30); // (text, x, y)
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
          return results;
        }
      
        for (var i = 0; i < string.length; i++) {
          var firstChar = string[i];
          var charsLeft = string.substring(0, i) + string.substring(i + 1);
          var innerPermutations = getAllPermutations(charsLeft);
          for (var j = 0; j < innerPermutations.length; j++) {
            results.push(firstChar + innerPermutations[j]);
          }
        }
        return results;
    }
    //

    var all_permutations = [];
    var permutations = [];

    for (var i = 0; i < combinations.length; i++) {
        permutations = getAllPermutations(combinations[i]); // list strings of permutations
        all_permutations.push(permutations); // join into a single string separated by spaces
    }

    console.log(all_permutations);

    // for (var i = 0; i < all_permutations.length; i++) {
    //     this.ctx.fillText(all_permutations[i], 10, 50 + i*30); // (text, x, y)
    // }

    this.adjustCanvasSize(all_permutations);
    for (var i = 0; i < all_permutations.length; i++) {
        for (var j = 0; j < all_permutations[i].length; j++) {
            this.ctx.fillText(all_permutations[i][j], 10 + j*60, 50 + i*30);
        }
        // this.ctx.fillText(all_permutations[i].join(" "), 10, 50 + i*30); // (text, x, y)
    }
}

Graph.prototype.adjustCanvasSize = function(list) {
    maxHeight = 50 + list.length*30;
    maxWidth = 0;

    var width = 10; // width is initially 50 
    for (var i = 0; i < list.length; i++) {
        width += list[i].length * 60;

        if (width > maxWidth) {
            maxWidth = width;
        }
        width = 10;
    }

    this.clear_canvas();
    if (maxWidth > this.canvas.width) {
        console.log("adjusting width");
        this.canvas.width = maxWidth + 50; // with some buffer
    }
    if (maxHeight > this.canvas.height) {
        console.log("adjusting height");
        this.canvas.height = maxHeight + 50; // with some buffer 
    }
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
        combinations.push([result.join("")]); //process here the result
        return;
      }
      for (let i = start; i <= input.length - len; i++) {
        result[result.length - len] = input[i];
        combine(input, len-1, i+1 );
      }
    }
    combine(choices, result.length, 0);
    //

    this.adjustCanvasSize(combinations);
    for (var i = 0; i < combinations.length; i++) {
        for (var j = 0; j < combinations[i].length; j++) {
            this.ctx.fillText(combinations[i][j], 10 + j*60, 50 + i*30);
        }
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
