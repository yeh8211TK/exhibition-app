import React, { Component } from 'react';
import {HashRouter, Route, Switch, Link} from "react-router-dom";
import './App.css';

class Text extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        id: this.props.match.params.id,
        data: [],
        showInfo: [],
     };
  }
  componentDidMount() {
    const Data = window.localStorage.getItem("data");
    const data = JSON.parse(Data);
    this.setState({
      data: data[this.state.id],
      showInfo: data[this.state.id].showInfo[0]
    })
  }
  render () {
    const {data, showInfo} = this.state;
    return (
      <div className="mainpage">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>活動名稱: <span className="tabletext">{data.title}</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>來源網站名稱: <span className="tabletext">{data.sourceWebName}</span></th>
            </tr>
            <tr>
              <th>開始日期: <span className="tabletext">{data.startDate}</span></th>
            </tr>
            <tr>
              <th>結束日期: <span className="tabletext">{data.endDate}</span></th>
            </tr>
            <tr>
              <th>地點: <span className="tabletext">{showInfo.location}</span></th>
            </tr>
            <tr>
              <th>介紹: <p className="tabletext">{data.descriptionFilterHtml}</p></th>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

class AllPosts extends Component {
  constructor (props) {
    super(props);
    this.state = {
      data: [],
    }
  }
  componentDidMount() {
    if (window.localStorage.getItem("data") === null) {
      const axios = require('axios').default;
      axios.get("https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=6")
        .then(res => {
           this.setState({
             data: res.data,
           })
        })
    } else {
        const Data = window.localStorage.getItem("data");
        const data = JSON.parse(Data);
        this.setState({
          data: data,
        })
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevState.data !== this.state.data) {
      window.localStorage.setItem('data',
        JSON.stringify(this.state.data));
    }
  }
  render() {
    const {data} = this.state;
    const style = {
      color: `Black`
    }
    return (
      <div className="mainpage">
        <h2>所有展覽</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>活動名稱</th>
            </tr>
          </thead>
          <tbody>
          {
            data.map((item, index) => (
              <tr>
                <td>
                  <Link to={`/Posts/${index}`} style={style}>{item.title}</Link>
                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
    )
  }
}

const About = () => {
  return (
    <div className="mainpage">
      <h2 className="about_title">關於本站</h2>
      <div className="about_content">
        本站利用 React.js + React-router 進行前端的畫面渲染和頁面路徑設定，資料方面則使用
        axios 串接政府資料開放平台的 API。 資料集是文化部整合本部及所屬各級機關(構)、以及其他公、民營單位的展覽資訊。[註: 本網站僅作為 demo 用途!]
      </div>
    </div>
  )
}

class Navpage extends Component {
  render() {
    const style = {
      color: `Black`
    }
    const nav = {
      padding: `10px`
    }
    return (
      <nav className="nav navbar-light bg-light" style={nav}>
        <span className="navbar-brand mb-0 h1">展覽資訊</span>
        <Link to="/Posts" className="nav-item nav-link" style={style}>活動名稱</Link>
        <Link to="/About" className="nav-item nav-link" style={style}>關於本站</Link>
      </nav>
    )
  }
}

const App = () => {
    return (
      <HashRouter>
        <Navpage/>
        <Switch>
          <Route path="/About" component={About}/>
          <Route exact path="/Posts" component={AllPosts}/>
          <Route path="/Posts/:id" component={Text}/>
        </Switch>
      </HashRouter>
    )
}

export default App;