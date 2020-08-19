// define factorial function and binomial coefficients
const fac = x => x ? x * fac (x - 1) : x + 1
const binom = (n, k) => fac (n) / fac (k) / fac (n - k >= 0 ? n - k : NaN)

function Graph(canvas, sliders) {
    // define canvas where graph will be drawn
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = Math.round(0.9 * canvas.height);
    this.ctx = this.canvas.getContext("2d");

    // binomial p.m.f.
    this.pmf = function(x) {
	return (
	    binom(this.n, x) *
		Math.pow(this.p, x) *
		Math.pow(1 - this.p, this.n - x)
	)
    }
    
    // bind sliders to the graph
    this.n = parseInt(sliders[0].value);
    this.p = parseFloat(sliders[1].value);
    this.update_n(this.n);
    this.update_p(this.p);
    var that = this;
    this.bind_slider(sliders[0], function(event) {
	that.update_n(this.value);
    });
    this.bind_slider(sliders[1], function(event) {
	that.update_p(this.value);
    });
    
    // draw axes
    this.xmin = -0.5;
    this.draw_axis(this.xmin, this.xmax);

    // draw function
    this.draw_pmf("#FF0000");
}

// event handler when n changes
Graph.prototype.update_n = function(n) {
    this.n = parseInt(n);
    this.xmax = this.n + 0.5;
    this.draw_axis(this.xmin, this.xmax);
    this.draw_pmf("#FF0000");
    document.querySelector("#n").innerHTML = this.n;
}

// event handler when p changes
Graph.prototype.update_p = function(p) {
    this.p = parseFloat(p);
    this.draw_axis(this.xmin, this.xmax);
    this.draw_pmf("#FF0000");
    document.querySelector("#p").innerHTML = this.p.toFixed(2);
}

// bind an event handler to the slider
Graph.prototype.bind_slider = function(slider, handler) {
    slider.oninput = handler;
}

// clear entire canvas
Graph.prototype.clear_canvas = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

// draw x-axis
Graph.prototype.draw_axis = function(xmin, xmax) {
    // clear canvas
    this.clear_canvas()
    
    // set stroke properties
    this.ctx.strokeStyle = "#000000";
    this.ctx.lineWidth = 1;
    
    // draw x-axis
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height);
    this.ctx.lineTo(this.width, this.height);
    this.ctx.stroke();

    // draw ticks
    for(var x=0; x<this.xmax; x++) {
	if(x % Math.ceil(this.n / 10) === 0) {
	    this.draw_line([x, -0.02], [x, 0]);
	    this.add_text(x, [x, -0.06]);
	} else {
	    this.draw_line([x, -0.01], [x, 0]);
	}
    }
}

// convert a point in graph coordinates to Canvas coordinates
Graph.prototype.point_to_coords = function(point) {
    var x = (point[0] - this.xmin) / (this.xmax - this.xmin) * this.width;
    var y = (1 - point[1]) * this.height;
    return [x, y]
}

// add text to a specified point (in graph coordinates)
Graph.prototype.add_text = function(text, point) {
    this.ctx.textAlign = "center";
    this.ctx.font = "14px Arial";
    coords = this.point_to_coords(point);
    this.ctx.fillText(text, coords[0], coords[1]);
}

// add line between specified points (in graph coordinates)
Graph.prototype.draw_line = function(start, end) {
    this.ctx.beginPath();
    start_coords = this.point_to_coords(start);
    this.ctx.moveTo(start_coords[0], start_coords[1]);
    end_coords = this.point_to_coords(end);
    this.ctx.lineTo(end_coords[0], end_coords[1]);
    this.ctx.stroke();
}

// draw the p.m.f.
Graph.prototype.draw_pmf = function(color) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    for(var x=0; x<this.xmax; x++) {
	this.draw_line([x, 0], [x, this.pmf(x)]);
    }
}

// initialize graph when page loads
document.addEventListener("DOMContentLoaded", function(event) {
    var graph = new Graph(
	document.querySelector("#graph"),
	document.querySelectorAll("input[type='range']")
    );
});
