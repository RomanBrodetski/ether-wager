class Tooltip extends React.Component {
  // <Tooltip placement="left" title="Tooltip on left">info</Tooltip>
  constructor(props) {
    super(props)

    this.state = {
      visible: false
    }
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this)
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)
  }

  onMouseEnterHandler() {
    this.setState({
      visible: true
    })
  }

  onMouseLeaveHandler() {
    this.setState({
      visible: false
    })
  }

  render() {

    return (
      <span role="tooltip" onMouseEnter={this.onMouseEnterHandler} onMouseLeave={this.onMouseLeaveHandler} style={{position:'relative',cursor:'pointer'}}>
        {this.props.children !== undefined
          ? this.props.children
          : <i className="fa fa-info-circle" aria-hidden="true"></i>
        }
        <div className={this.state.visible ? "myTooltip" : "hidden"}>
          {this.props.title}
        </div>
      </span>
    );
  }
}
