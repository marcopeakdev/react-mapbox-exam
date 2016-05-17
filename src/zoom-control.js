import React, { Component } from "react";

const containerStyle = {
  position: "absolute",
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  boxShadow: "0px 1px 4px rgba(0, 0, 0, .3)",
  border: "1px solid rgba(0, 0, 0, 0.1)"
};

const positions = {
  topRight: { top: 10, right: 10, bottom: "auto", left: "auto" },
  topLeft: { top: 10, left: 10, bottom: "auto", right: "auto" },
  bottomRight: { bottom: 10, right: 10, top: "auto", left: "auto" },
  bottomLeft: { bottom: 10, left: 10, top: "auto", right: "auto" }
};

const buttonStyle = {
  backgroundColor: "#f9f9f9",
  opacity: .95,
  transition: "background-color 0.16s ease-out",
  cursor: "pointer",
  border: 0,
  height: 26,
  width: 26,
  backgroundImage: "url('https://api.mapbox.com/mapbox.js/v2.4.0/images/icons-000000@2x.png')",
  backgroundPosition: "0px 0px",
  backgroundSize: "26px 260px",
  outline: 0
};

const buttonStyleHovered = {
  backgroundColor: "#fff",
  opacity: 1
};

const buttonStylePlus = {
  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
  borderTopLeftRadius: 2,
  borderTopRightRadius: 2
};

const buttonStyleMinus = {
  backgroundPosition: "0px -26px",
  borderBottomLeftRadius: 2,
  borderBottomRightRadius: 2
};

const [ PLUS, MINUS ] = [ 0, 1 ];
const POSITIONS = [ "top-right", "top-left", "bottom-right", "bottom-left" ];

export default class ZoomControl extends Component {
  static propTypes = {
    zoomDiff: React.PropTypes.number,
    onControlClick: React.PropTypes.func,
    position: React.PropTypes.string
  };

  static defaultProps = {
    position: "top-right"
  };

  state = {
    hover: undefined
  };

  static contextTypes = {
    map: React.PropTypes.object
  };

  _onMouse = hover => {
    if(hover !== this.state.hover) {
      this.setState({ hover });
    }
  };

  render() {
    const { onControlClick, zoomDiff, position } = this.props;
    const { hover } = this.state;
    const { map } = this.context;

    return (
      <div
        style={{
          ...containerStyle,
          ...(position === POSITIONS[0] && positions.topRight),
          ...(position === POSITIONS[1] && positions.topLeft),
          ...(position === POSITIONS[2] && positions.bottomRight),
          ...(position === POSITIONS[3] && positions.bottomLeft)
        }}>
        <button
          style={{
            ...buttonStyle,
            ...buttonStylePlus,
            ...(hover === PLUS && buttonStyleHovered)
          }}
          onMouseOver={this._onMouse.bind(this, PLUS)}
          onMouseOut={this._onMouse}
          onClick={onControlClick.bind(this, map, zoomDiff)}>
        </button>
        <button
          style={{
            ...buttonStyle,
            ...buttonStyleMinus,
            ...(hover === MINUS && buttonStyleHovered)
          }}
          onMouseOver={this._onMouse.bind(this, MINUS)}
          onMouseOut={this._onMouse}
          onClick={onControlClick.bind(this, map, -zoomDiff)}>
        </button>
      </div>
    );
  }
}
