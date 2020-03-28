import Chart from 'chart.js';
import React, { Component } from "react";

class Bubble extends React.Component {

  constructor(props) {
    super(props);
    this.uniqueColor = [];
    this.chartRef = React.createRef();
    this.state = {};
  }

  componentDidUpdate() {
    let datasets = this.getDataSet();
    this.myChart.data.datasets = datasets;
    this.myChart.update();
  }

  componentDidMount() {
    let datasets = this.getDataSet();
    this.myChart = new Chart(this.chartRef.current, {
      type: 'bubble',
      data:
      {
        datasets: datasets
      }
    });
  }

  getDataSet() {
    let clubs = this.props.clubs || [];
    let datasets = [];
    clubs.forEach(club => {
      let obj = {};
      let dataObj = {};
      obj.label = club.name;
      obj.data = [];
      dataObj.x = club.lost;
      dataObj.y = club.won;
      dataObj.r = club.goal;
      obj.data.push(dataObj);
      let uniqueColor = this.getColor();
      obj.backgroundColor = uniqueColor;
      obj.hoverBackgroundColor = uniqueColor;
      datasets.push(obj);
    });
    return datasets;
  }

  getColor() {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    if (this.uniqueColor && this.uniqueColor.indexOf(randomColor) == -1) {
      this.uniqueColor.push(randomColor);
      return '#' + randomColor;
    }
    else {
      return this.getColor();
    }
  }

  render() {
    return <canvas ref={this.chartRef} width="600" height="400" />;
  }
}

export default Bubble;


