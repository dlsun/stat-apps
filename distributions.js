// define factorial function and binomial coefficients
const fac = x => x ? x * fac (x - 1) : x + 1
const binom = (n, k) => fac (n) / fac (k) / fac (n - k >= 0 ? n - k : NaN)

function Graph(canvas, sliders) {
    // define canvas where graph will be drawn
    this.pmf_canvas = canvas[0];
    this.cdf_canvas = canvas[1];

    this.pmf_canvas_width = canvas[0].width;
    this.cdf_canvas_width = canvas[1].width;

    this.pmf_canvas_height = Math.round(0.9 * canvas[0].height);
    this.cdf_canvas_height = Math.round(0.9 * canvas[1].height);

    this.pmf_ctx = canvas[0].getContext("2d");
    this.cdf_ctx = canvas[1].getContext("2d");

    // binomial p.m.f.
    this.pmf = function(x) {
	return (
	    // this.n *
        // Math.pow(Math.E, -this.n * x)
        binom(this.n, x) *
        Math.pow(this.p, x) *
        Math.pow(1 - this.p, this.n - x)
	    )
    }
    
    // binomial c.d.f. 
    function Lanczos_Gamma(num) 
    {
      var p = [
        0.99999999999980993, 676.5203681218851, -1259.1392167224028,
        771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
      ];
      var i;
      var g = 7;
      if (num < 0.5) return Math.PI / (Math.sin(Math.PI * num) * calculus.LanczosGamma(1 - num));
      num -= 1;
      var a = p[0];
      var t = num + g + 0.5;
      for (i = 1; i < p.length; i++) {
        a += p[i] / (num + i);
      }
      return Math.sqrt(2 * Math.PI) * Math.pow(t, num + 0.5) * Math.exp(-t) * a;
    }

    function Betinc(X,A,B) {
        var A0=0;
        var B0=1;
        var A1=1;
        var B1=1;
        var M9=0;
        var A2=0;
        var C9;
        while (Math.abs((A1-A2)/A1)>.00001) {
            A2=A1;
            C9=-(A+M9)*(A+B+M9)*X/(A+2*M9)/(A+2*M9+1);
            A0=A1+C9*A0;
            B0=B1+C9*B0;
            M9=M9+1;
            C9=M9*(B-M9)*X/(A+2*M9-1)/(A+2*M9);
            A1=A0+C9*A1;
            B1=B0+C9*B1;
            A0=A0/B1;
            B0=B0/B1;
            A1=A1/B1;
            B1=1;
        }
        return A1/A
    }

    this.cdf = function (x) {
        X = x
        N=this.n
        P=this.p
        with (Math) {
            if (N<=0) {
                alert("sample size must be positive")
            } else if ((P<0)||(P>1)) {
                alert("probability must be between 0 and 1")
            } else if (X<0) {
                bincdf=0
            } else if (X>=N) {
                bincdf=1
            } else {
                X=floor(X);
                Z=P;
                A=X+1;
                B=N-X;
                S=A+B;
                BT=exp(Math.log(Lanczos_Gamma(S))-Math.log(Lanczos_Gamma(B))-Math.log(Lanczos_Gamma(A))+A*log(Z)+B*log(1-Z));
                if (Z<(A+1)/(S+2)) {
                    Betacdf=BT*Betinc(Z,A,B)
                } else {
                    Betacdf=1-BT*Betinc(1-Z,B,A)
                }
                bincdf=1-Betacdf;
            }
            bincdf=round(bincdf*100000)/100000;
        }
        return bincdf
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
    
    // draw axes for pmf 
    this.xmin = -0.5;
    this.draw_axis(this.pmf_canvas, this.pmf_ctx, this.xmin, this.xmax);

    // draw pmf function
    this.draw_pmf(this.pmf_canvas, this.pmf_ctx, "#FF0000");

    // draw axes for cdf
    this.draw_axis(this.cdf_canvas, this.cdf_ctx, this.xmin, this.xmax);

    // draw cdf function (TODO: needs to be implemented)
    this.draw_cdf(this.cdf_canvas, this.cdf_ctx, "#0026FF");
}

// event handler when n changes
Graph.prototype.update_n = function(n) {
    this.n = parseInt(n);
    this.xmax = this.n + 0.5;

    // draw axis and pmf for pmf canvas
    this.draw_axis(this.pmf_canvas, this.pmf_ctx, this.xmin, this.xmax);
    this.draw_pmf(this.pmf_canvas, this.pmf_ctx, "#FF0000"); // red

    // draw axis and cdf for cdf canvas
    this.draw_axis(this.cdf_canvas, this.cdf_ctx, this.xmin, this.xmax);
    this.draw_cdf(this.cdf_canvas, this.cdf_ctx, "#0026FF"); // blue

    // update n in the html
    document.querySelector("#n").innerHTML = this.n;
}

// event handler when p changes
Graph.prototype.update_p = function(p) {
    this.p = parseFloat(p);

    // draw axis and pmf for pmf canvas
    this.draw_axis(this.pmf_canvas, this.pmf_ctx, this.xmin, this.xmax);
    this.draw_pmf(this.pmf_canvas, this.pmf_ctx, "#FF0000");

    // draw axis and cdf for cdf canvas
    this.draw_axis(this.cdf_canvas, this.cdf_ctx, this.xmin, this.xmax);
    this.draw_cdf(this.cdf_canvas, this.cdf_ctx, "#0026FF");

    // update p in the html
    document.querySelector("#p").innerHTML = this.p.toFixed(2);
}

// bind an event handler to the slider
Graph.prototype.bind_slider = function(slider, handler) {
    slider.oninput = handler;
}

// clear entire canvas
Graph.prototype.clear_canvas = function(canvas, canvas_ctx) {
    canvas_ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// draw x-axis
Graph.prototype.draw_axis = function(canvas, canvas_ctx, xmin, xmax) {
    // clear the canvas
    this.clear_canvas(canvas, canvas_ctx);
    
    // set stroke properties for both canvases
    canvas_ctx.strokeStyle = "#000000";

    canvas_ctx.lineWidth = 1;
    
    // draw x-axis for canvas 
    canvas_ctx.beginPath();
    canvas_ctx.moveTo(0, canvas.height);
    canvas_ctx.lineTo(canvas.width, canvas.height);
    canvas_ctx.stroke();

    // draw ticks for canvas
    for(var x=0; x<this.xmax; x++) {
        if(x % Math.ceil(this.n / 10) === 0) {
            this.draw_line(canvas, canvas_ctx, [x, -0.02], [x, 0]);
            this.add_text(canvas, canvas_ctx, x, [x, -0.06]);
        } else {
            this.draw_line(canvas, canvas_ctx, [x, -0.01], [x, 0]);
        }
    }
    
}

// convert a point in graph coordinates to Canvas coordinates
Graph.prototype.point_to_coords = function(canvas, point) {
    var x = (point[0] - this.xmin) / (this.xmax - this.xmin) * canvas.width;
    var y = (1 - point[1]) * canvas.height;
    return [x, y]
}

// add text to a specified point (in graph coordinates)
Graph.prototype.add_text = function(canvas, canvas_ctx, text, point) {
    canvas_ctx.textAlign = "center";
    canvas_ctx.font = "14px Arial";
    coords = this.point_to_coords(canvas, point);
    canvas_ctx.fillText(text, coords[0], coords[1]);
}

// add line between specified points (in graph coordinates)
Graph.prototype.draw_line = function(canvas, canvas_ctx, start, end) {
    canvas_ctx.beginPath();
    start_coords = this.point_to_coords(canvas, start);
    canvas_ctx.moveTo(start_coords[0], start_coords[1]);
    end_coords = this.point_to_coords(canvas, end);
    canvas_ctx.lineTo(end_coords[0], end_coords[1]);
    canvas_ctx.stroke();
}

// draw the p.m.f.
Graph.prototype.draw_pmf = function(canvas, canvas_ctx, color) {
    canvas_ctx.strokeStyle = color;
    canvas_ctx.lineWidth = 2;
    for(var x=0; x<this.xmax; x++) {
        this.draw_line(canvas, canvas_ctx, [x, 0], [x, this.pmf(x)/2]);
    }
}

// draw the c.d.f.
Graph.prototype.draw_cdf = function(canvas, canvas_ctx, color) {
    canvas_ctx.strokeStyle = color;
    canvas_ctx.lineWidth = 2;
    for(var x=0; x<this.xmax; x++) {
    this.draw_line(canvas, canvas_ctx, [x, 0], [x, this.cdf(x)/2]);
    }
}

// initialize graph when page loads
document.addEventListener("DOMContentLoaded", function(event) {
    var graph = new Graph(
	document.querySelectorAll("canvas"),
	document.querySelectorAll("input[type='range']")
    );
});