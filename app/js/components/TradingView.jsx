class TradingView extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <iframe frameBorder="0" style={{width: "100%", height:"400px"}} src={"chart.html?value=" + this.props.symbol} id="content" ></iframe>
    )
  }
}
