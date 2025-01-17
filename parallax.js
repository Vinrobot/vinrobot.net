! function($, b, c, d) {
	"use strict";
	function h(b, c) {
		this.element = b, this.$context = $(b).data("api", this), this.$layers = this.$context.find(".layer");
		var d = {
			calibrateX: this.$context.data("calibrate-x") || null,
			calibrateY: this.$context.data("calibrate-y") || null,
			invertX: this.$context.data("invert-x") || null,
			invertY: this.$context.data("invert-y") || null,
			limitX: parseFloat(this.$context.data("limit-x")) || null,
			limitY: parseFloat(this.$context.data("limit-y")) || null,
			scalarX: parseFloat(this.$context.data("scalar-x")) || null,
			scalarY: parseFloat(this.$context.data("scalar-y")) || null,
			frictionX: parseFloat(this.$context.data("friction-x")) || null,
			frictionY: parseFloat(this.$context.data("friction-y")) || null,
			originX: parseFloat(this.$context.data("origin-x")) || null,
			originY: parseFloat(this.$context.data("origin-y")) || null
		};
		for (var e in d) null === d[e] && delete d[e];
		$.extend(this, g, c, d), this.calibrationTimer = null, this.calibrationFlag = !0, this.enabled = !1, this.depths = [], this.raf = null, this.bounds = null, this.ex = 0, this.ey = 0, this.ew = 0, this.eh = 0, this.ecx = 0, this.ecy = 0, this.erx = 0, this.ery = 0, this.cx = 0, this.cy = 0, this.ix = 0, this.iy = 0, this.mx = 0, this.my = 0, this.vx = 0, this.vy = 0, this.onMouseMove = this.onMouseMove.bind(this), this.onDeviceOrientation = this.onDeviceOrientation.bind(this), this.onOrientationTimer = this.onOrientationTimer.bind(this), this.onCalibrationTimer = this.onCalibrationTimer.bind(this), this.onAnimationFrame = this.onAnimationFrame.bind(this), this.onWindowResize = this.onWindowResize.bind(this), this.initialise()
	}
	var f = 30,
		g = {
			relativeInput: !1,
			clipRelativeInput: !1,
			calibrationThreshold: 100,
			calibrationDelay: 500,
			supportDelay: 500,
			calibrateX: !1,
			calibrateY: !0,
			invertX: !0,
			invertY: !0,
			limitX: !1,
			limitY: !1,
			scalarX: 10,
			scalarY: 10,
			frictionX: .1,
			frictionY: .1,
			originX: .5,
			originY: .5
		};
	h.prototype.transformSupport = function(a) {
		for (var e = c.createElement("div"), f = !1, g = null, h = !1, i = null, j = null, k = 0, l = this.vendors.length; k < l; k++)
			if (null !== this.vendors[k] ? (i = this.vendors[k][0] + "transform", j = this.vendors[k][1] + "Transform") : (i = "transform", j = "transform"), e.style[j] !== d) {
				f = !0;
				break
			}
		switch (a) {
			case "2D":
				h = f;
				break;
			case "3D":
				if (f) {
					var m = c.body || c.createElement("body"),
						n = c.documentElement,
						o = n.style.overflow;
					c.body || (n.style.overflow = "hidden", n.appendChild(m), m.style.overflow = "hidden", m.style.background = ""), m.appendChild(e), e.style[j] = "translate3d(1px,1px,1px)", g = b.getComputedStyle(e).getPropertyValue(i), h = g !== d && g.length > 0 && "none" !== g, n.style.overflow = o, m.removeChild(e)
				}
		}
		return h
	}, h.prototype.ww = null, h.prototype.wh = null, h.prototype.wcx = null, h.prototype.wcy = null, h.prototype.wrx = null, h.prototype.wry = null, h.prototype.portrait = null, h.prototype.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i), h.prototype.vendors = [null, ["-webkit-", "webkit"],
		["-moz-", "Moz"],
		["-o-", "O"],
		["-ms-", "ms"]
	], h.prototype.motionSupport = !!b.DeviceMotionEvent, h.prototype.orientationSupport = !!b.DeviceOrientationEvent, h.prototype.orientationStatus = 0, h.prototype.transform2DSupport = h.prototype.transformSupport("2D"), h.prototype.transform3DSupport = h.prototype.transformSupport("3D"), h.prototype.propertyCache = {}, h.prototype.initialise = function() {
		"static" === this.$context.css("position") && this.$context.css({
			position: "relative"
		}), this.accelerate(this.$context), this.updateLayers(), this.updateDimensions(), this.enable(), this.queueCalibration(this.calibrationDelay)
	}, h.prototype.updateLayers = function() {
		this.$layers = this.$context.find(".layer"), this.depths = [], this.$layers.css({
			position: "absolute",
			display: "block",
			left: 0,
			top: 0
		}), this.$layers.first().css({
			position: "relative"
		}), this.accelerate(this.$layers), this.$layers.each($.proxy(function(b, c) {
			this.depths.push($(c).data("depth") || 0)
		}, this))
	}, h.prototype.updateDimensions = function() {
		this.ww = b.innerWidth, this.wh = b.innerHeight, this.wcx = this.ww * this.originX, this.wcy = this.wh * this.originY, this.wrx = Math.max(this.wcx, this.ww - this.wcx), this.wry = Math.max(this.wcy, this.wh - this.wcy)
	}, h.prototype.updateBounds = function() {
		this.bounds = this.element.getBoundingClientRect(), this.ex = this.bounds.left, this.ey = this.bounds.top, this.ew = this.bounds.width, this.eh = this.bounds.height, this.ecx = this.ew * this.originX, this.ecy = this.eh * this.originY, this.erx = Math.max(this.ecx, this.ew - this.ecx), this.ery = Math.max(this.ecy, this.eh - this.ecy)
	}, h.prototype.queueCalibration = function(a) {
		clearTimeout(this.calibrationTimer), this.calibrationTimer = setTimeout(this.onCalibrationTimer, a)
	}, h.prototype.enable = function() {
		this.enabled || (this.enabled = !0, this.orientationSupport ? (this.portrait = null, b.addEventListener("deviceorientation", this.onDeviceOrientation), setTimeout(this.onOrientationTimer, this.supportDelay)) : (this.cx = 0, this.cy = 0, this.portrait = !1, b.addEventListener("mousemove", this.onMouseMove)), b.addEventListener("resize", this.onWindowResize), this.raf = requestAnimationFrame(this.onAnimationFrame))
	}, h.prototype.disable = function() {
		this.enabled && (this.enabled = !1, this.orientationSupport ? b.removeEventListener("deviceorientation", this.onDeviceOrientation) : b.removeEventListener("mousemove", this.onMouseMove), b.removeEventListener("resize", this.onWindowResize), cancelAnimationFrame(this.raf))
	}, h.prototype.calibrate = function(a, b) {
		this.calibrateX = a === d ? this.calibrateX : a, this.calibrateY = b === d ? this.calibrateY : b
	}, h.prototype.invert = function(a, b) {
		this.invertX = a === d ? this.invertX : a, this.invertY = b === d ? this.invertY : b
	}, h.prototype.friction = function(a, b) {
		this.frictionX = a === d ? this.frictionX : a, this.frictionY = b === d ? this.frictionY : b
	}, h.prototype.scalar = function(a, b) {
		this.scalarX = a === d ? this.scalarX : a, this.scalarY = b === d ? this.scalarY : b
	}, h.prototype.limit = function(a, b) {
		this.limitX = a === d ? this.limitX : a, this.limitY = b === d ? this.limitY : b
	}, h.prototype.origin = function(a, b) {
		this.originX = a === d ? this.originX : a, this.originY = b === d ? this.originY : b
	}, h.prototype.clamp = function(a, b, c) {
		return a = Math.max(a, b), a = Math.min(a, c)
	}, h.prototype.css = function(b, c, e) {
		var f = this.propertyCache[c];
		if (!f)
			for (var g = 0, h = this.vendors.length; g < h; g++)
				if (f = null !== this.vendors[g] ? $.camelCase(this.vendors[g][1] + "-" + c) : c, b.style[f] !== d) {
					this.propertyCache[c] = f;
					break
				}
		b.style[f] = e
	}, h.prototype.accelerate = function(a) {
		for (var b = 0, c = a.length; b < c; b++) {
			var d = a[b];
			this.css(d, "transform", "translate3d(0,0,0)"), this.css(d, "transform-style", "preserve-3d"), this.css(d, "backface-visibility", "hidden")
		}
	}, h.prototype.setPosition = function(a, b, c) {
		b += "px", c += "px", this.transform3DSupport ? this.css(a, "transform", "translate3d(" + b + "," + c + ",0)") : this.transform2DSupport ? this.css(a, "transform", "translate(" + b + "," + c + ")") : (a.style.left = b, a.style.top = c)
	}, h.prototype.onOrientationTimer = function(a) {
		this.orientationSupport && 0 === this.orientationStatus && (this.disable(), this.orientationSupport = !1, this.enable())
	}, h.prototype.onCalibrationTimer = function(a) {
		this.calibrationFlag = !0
	}, h.prototype.onWindowResize = function(a) {
		this.updateDimensions()
	}, h.prototype.onAnimationFrame = function() {
		this.updateBounds();
		var a = this.ix - this.cx,
			b = this.iy - this.cy;
		(Math.abs(a) > this.calibrationThreshold || Math.abs(b) > this.calibrationThreshold) && this.queueCalibration(0), this.portrait ? (this.mx = this.calibrateX ? b : this.iy, this.my = this.calibrateY ? a : this.ix) : (this.mx = this.calibrateX ? a : this.ix, this.my = this.calibrateY ? b : this.iy), this.mx *= this.ew * (this.scalarX / 100), this.my *= this.eh * (this.scalarY / 100), isNaN(parseFloat(this.limitX)) || (this.mx = this.clamp(this.mx, -this.limitX, this.limitX)), isNaN(parseFloat(this.limitY)) || (this.my = this.clamp(this.my, -this.limitY, this.limitY)), this.vx += (this.mx - this.vx) * this.frictionX, this.vy += (this.my - this.vy) * this.frictionY;
		for (var c = 0, d = this.$layers.length; c < d; c++) {
			var e = this.depths[c],
				f = this.$layers[c],
				g = this.vx * e * (this.invertX ? -1 : 1),
				h = this.vy * e * (this.invertY ? -1 : 1);
			this.setPosition(f, g, h)
		}
		this.raf = requestAnimationFrame(this.onAnimationFrame)
	}, h.prototype.onDeviceOrientation = function(a) {
		if (!this.desktop && null !== a.beta && null !== a.gamma) {
			this.orientationStatus = 1;
			var c = (a.beta || 0) / f,
				d = (a.gamma || 0) / f,
				e = b.innerHeight > b.innerWidth;
			this.portrait !== e && (this.portrait = e, this.calibrationFlag = !0), this.calibrationFlag && (this.calibrationFlag = !1, this.cx = c, this.cy = d), this.ix = c, this.iy = d
		}
	}, h.prototype.onMouseMove = function(a) {
		var b = a.clientX,
			c = a.clientY;
		!this.orientationSupport && this.relativeInput ? (this.clipRelativeInput && (b = Math.max(b, this.ex), b = Math.min(b, this.ex + this.ew), c = Math.max(c, this.ey), c = Math.min(c, this.ey + this.eh)), this.ix = (b - this.ex - this.ecx) / this.erx, this.iy = (c - this.ey - this.ecy) / this.ery) : (this.ix = (b - this.wcx) / this.wrx, this.iy = (c - this.wcy) / this.wry)
	};
	var i = {
		enable: h.prototype.enable,
		disable: h.prototype.disable,
		updateLayers: h.prototype.updateLayers,
		calibrate: h.prototype.calibrate,
		friction: h.prototype.friction,
		invert: h.prototype.invert,
		scalar: h.prototype.scalar,
		limit: h.prototype.limit,
		origin: h.prototype.origin
	};
	var e = "parallax";
	$.fn[e] = function(b) {
		var c = arguments;
		return this.each(function() {
			var d = $(this), f = d.data(e);
			f || (f = new h(this, b), d.data(e, f)), i[b] && f[b].apply(f, Array.prototype.slice.call(c, 1))
		})
	}
}(window.jQuery || window.Zepto, window, document);
