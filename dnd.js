var DND = {
	elem: null,
	state: 0,
	mdPos: {
		x: null,
		y: null
	},
	offset: {
		x: null,
		y: null
	},
	copyPos: {
		x: null,
		y: null
	},
	dropPlace: {
		x: null,
		y: null,
		width: null,
		height: null
	},
	target: {
		width: null,
		height: null
	},
	idFX: null,
	clear: function () {
		DND.state = 0;
		DND.elem = null;
		DND.mdPos.x = null;
		DND.mdPos.y = null;
		DND.offset.x = null;
		DND.offset.y = null;
		DND.copyPos.x = null;
		DND.copyPos.y = null;
		DND.target.width = null;
		DND.target.height = null;
		DND.dataFX = null;
	},
	cancelCheck: function (e) {
		e.preventDefault();
		DND.elem.removeEventListener("mousemove", DND.startedCheck);
		DND.elem.removeEventListener("mouseup", DND.cancelCheck);
		DND.clear();
	},
	cancelDrag: function () {
		window.ee.removeEvent("movingCopy");
		window.document.removeEventListener("mousemove", DND.movingCopy);
		window.document.removeEventListener("mouseup", DND.drop);
		DND.clear();
		window.ee.emit("cancelDrag");
	},
	drop: function (e) {
		e.preventDefault();
		if (e.x - DND.offset.x < DND.dropPlace.width &&
			e.x - DND.offset.x + DND.target.width > DND.dropPlace.x &&
			e.y - DND.offset.y < DND.dropPlace.height &&
			e.y - DND.offset.x + DND.target.height > DND.dropPlace.y) {
			glass.push(scripts[DND.elem.dataset.id]);
			window.ee.emit("addFX");
		};
		DND.cancelDrag();
	},
	mouseDown: function (e, elem) {
		e.preventDefault();
		DND.state = 1;
		DND.mdPos.x = e.x;
		DND.mdPos.y = e.y;
		DND.offset.x = e.offsetX;
		DND.offset.y = e.offsetY;
		DND.elem = elem;
		DND.elem.addEventListener("mousemove", DND.startedCheck);
		DND.elem.addEventListener("mouseup", DND.cancelCheck);
	},
	startedCheck: function (e) {
		e.preventDefault();
		if (DND.state != 1) {
			return false;
		};
		if (Math.abs(e.x - DND.mdPos.x) > 5 ||
			Math.abs(e.y - DND.mdPos.y) > 5) {
			DND.state = 2;
			DND.setCopyPos(e);
			DND.elem.removeEventListener("mousemove", DND.startedCheck);
			DND.elem.removeEventListener("mouseup", DND.cancelCheck);
			window.document.addEventListener("mousemove", DND.movingCopy);
			window.document.addEventListener("mouseup", DND.drop);
			window.ee.emit("startCopy");
		};
	},
	setCopyPos: function (e) {
		DND.copyPos.x = e.x - DND.offset.x;
		DND.copyPos.y = e.y - DND.offset.y;
	},
	movingCopy: function (e) {
		e.preventDefault();
		if (DND.state != 2) {
			return false
		};
		DND.setCopyPos(e);
		window.ee.emit("movingCopy");
	}
}