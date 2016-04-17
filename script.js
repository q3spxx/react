window.ee = new EventEmitter();

var Main = React.createClass({
	render: function () {
		return (
			<div>
				<Glass />
				<Scripts />
				<Copy />
			</div>
		);
	}
});

var Glass = React.createClass({
	getInitialState: function () {
		return {
			glass: glass,
			dropField: false
		}
	},
	componentWillMount: function () {
		var self = this;
		window.ee.addListener("addFX", self.update);
		window.ee.addListener("startCopy", function () {
			self.setState({
				dropField: true
			});
		});
		window.ee.addListener("cancelDrag", function () {
			self.setState({
				dropField: false
			});
		});
	},
	update: function () {
		this.setState({
			glass: glass
		});
	},
	componentDidMount: function () {
		var elem = ReactDOM.findDOMNode(this.refs.glass);
		DND.dropPlace.width = elem.clientWidth;
		DND.dropPlace.height = elem.clientHeight;
	},
	render: function () {
		var self = this;
		return (
			<div className="glass" ref="glass">
				{
					this.state.dropField ? <DropField /> : ""
				}
				{
					glass.map(function (script, i) {
						return <GFX glass={self.state.glass}
											key={i}
											id={i}
											glassComp={self} />
					})
				}
			</div>
		);
	}
});
var GFX = React.createClass({
	del: function () {
		this.props.glass.splice(this.props.id, 1);
		this.props.glassComp.update();
	},
	render: function () {
		return (
			<div className="gFx" data-id={this.props.id}>
				<input type="button"
						value="удалить"
						onClick={this.del} />
			</div>
		);
	}
});
var SFX = React.createClass({
	componentDidMount: function () {
		var elem = ReactDOM.findDOMNode(this.refs.item);
		elem.addEventListener("mousedown", function (e) {
			DND.target.x = elem.clientLeft;
			DND.target.y = elem.clientTop;
			DND.target.width = elem.clientWidth;
			DND.target.height = elem.clientHeight;
			DND.mouseDown(e, elem);
			DND.idFX = elem.dataset.id;
		});
	},
	render: function () {
		return (
			<div className="sFx" data-id={this.props.id} ref="item">
			</div>
		)
	}
});
var Scripts = React.createClass({
	getInitialState: function () {
		return {
			scripts: scripts
		}
	},
	render: function () {
		var self = this;
		return (
			<div className="scripts">
				{
					self.state.scripts.map(function (script, i) {
						return <SFX key={i} id={i} />;
					})
				}
			</div>
		);
	}
});
var CopyFX = React.createClass({
	getInitialState: function () {
		return ({
			x: DND.copyPos.x,
			y: DND.copyPos.y
		})
	},
	updatePos: function () {
		this.setState({
			x: DND.copyPos.x,
			y: DND.copyPos.y
		});
	},
	componentWillMount: function () {
		var self = this;
		window.ee.addListener("movingCopy", self.updatePos);
	},
	render: function () {
		var style = {
			left: this.state.x + "px",
			top: this.state.y + "px"
		};
		return (
			<div className="copyFX" 
				style={style}
				ref="copyFX"></div>
		)
	}
});

var DropField = React.createClass({
	render: function () {
		return (
			<div className="dropField">
				<div className="dropFieldText">Please, drag and drop script here</div>
			</div>
		)
	}
});
var Copy = React.createClass({
	getInitialState: function () {
		return {
			onCopy: false
		}
	},
	startCopy: function () {
		this.setState({
			onCopy: true
		})
	},
	cancel: function () {
		this.setState({
			onCopy: false
		})
	},
	componentWillMount: function () {
		var self = this;
		window.ee.addListener("cancelDrag", self.cancel);
		window.ee.addListener("startCopy", self.startCopy);
	},
	render: function () {
		return (
			<div ref="copy">
				{
					this.state.onCopy ? <CopyFX /> : ""
				}
			</div>
		)
	}
});

ReactDOM.render(
		<Main />,
		document.getElementById("mainWrap")
);