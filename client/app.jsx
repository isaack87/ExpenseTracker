

class Budget extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expense: {
        date: "",
        item: "",
        price: ""
      },
      expenseList: [],
      totalCount: '',
      RemainingBudget: "",
      expenseBanner: "",
      date: new Date().toLocaleString()
    };

    this.handleChangePrice = this.handleChangePrice.bind(this)
    this.handleChangeItem = this.handleChangeItem.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.analyze = this.analyze.bind(this)
    this.getCurrentMonth = this.getCurrentMonth.bind(this)
    this.handleAjax = this.handleAjax.bind(this)
  }

  handleChangePrice = e => {
    const name = e.target.name
    const value = e.target.value
    const allowed = /^[0-9\b]+$/;

    if (e.target.value === '' || allowed.test(e.target.value)) {
    this.setState(e => ({
      expense: { ...e.expense, [name]: value }
    }));
  }
  };

  handleChangeItem = e => {
    const name = e.target.name
    const value = e.target.value

    this.setState(e => ({
      expense: { ...e.expense, [name]: value }
    }));
  };


  //

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState(e => ({
      expenseList: [...e.expenseList, e.expense],
      expense: {  date: "" , item: "", price: ""}
    }), () => {
      this.handleAjax()
    })
  };

  handleAjax = () => {
    var data = this.state.expenseList
    $.ajax({
      method: 'POST',
      url: 'http://localhost:8000/',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: (data => {
        console.log('send data to server')
      }),
      error: () => {
        console.log('error')
      }
    })
  }

  getCurrentMonth = () => {
    var monthNames = ["January", "February", "March", "April", "May","June","July", "August", "September", "October", "November","December"];
    var month = monthNames[new Date().getMonth()]
    return month
  }

  analyze = () => {
    var count = 0;
        for (var i =0; i < this.state.expenseList.length; i++) {
          var data = parseInt(this.state.expenseList[i].price)
          count+= data
        }

        const totalBudget = this.props.currentBudget
        const underBudget = `You have $${totalBudget-count}.00 left to spend.`
        const overBudget = `You went over budget $${Math.abs(totalBudget-count)}.00 and have $0.00 to spend`
        let budget;

        if (totalBudget-count > 0) {
          budget = underBudget
        } else {
          budget = overBudget
        }

      this.setState({
        totalCount: `In the Month of ${this.getCurrentMonth()} you spent a total of $${count}.00`,
        RemainingBudget: budget,
        expenseBanner: `${this.getCurrentMonth()}'s Budget Report`
      })

      return count
    }

render() {
  return (
  <div>
        <h3>Log Expenses</h3>
        <form>
        <label>
          Date:
          <input name="date" onChange={this.handleChangeItem} type="date" value={this.state.expense.date}/>
          <br/>
          </label>
        <label>
          Item:
          <input name="item" onChange={this.handleChangeItem} type="text" value={this.state.expense.item} placeholder="type expense here ...."/>
          <br/>
          </label>
          Price:
          <input
            name="price" onChange={this.handleChangePrice} type="number" value={this.state.expense.price} placeholder="enter whole price only" />{" "}
             <button onClick={this.handleSubmit}>Submit</button>
          <br/>
          <br/>
        </form>
        <ul>
          {this.state.expenseList.map((list, index) => (
            <li key={index}>
               {list.date} ➖ {list.item} ➖ ${list.price}.00
            </li>
          ))}
        </ul>
        <br>
        </br>
        <img src='/line.jpeg'  width="350"
            height="10"></img>
        <div>
          <p>{this.state.expenseBanner}</p>
        </div>
      {this.state.totalCount}
        <p>
          {this.state.RemainingBudget}
        </p>
        <div>
        <button className="budget" onClick={this.analyze}>Generate Budget Report</button>
        </div>
  </div>)
  }
}



class App extends React.Component {
  constructor(props) {
    super(props)
  this.state = {
    budgets: {
      budget: ''
    },
    currentBudget: "",
    date: new Date().toLocaleString()
  };

  this.tick.bind(this)
  this.handleAlternate = this.handleAlternate.bind(this)
  this.handleBudgetChange = this.handleBudgetChange.bind(this)
  this.getCurrentMonth = this.getCurrentMonth.bind(this)
}

  componentDidMount = () => {
    this.intervalID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount = () => {
    clearInterval(this.intervalID);

  }

  tick = () => {
    this.setState({
      date: new Date().toLocaleString()
    });
  }

getCurrentMonth = () => {
  var monthNames = ["January", "February", "March", "April", "May","June","July", "August", "September", "October", "November","December"];
  var month = monthNames[new Date().getMonth()]
  return month
}

  handleBudgetChange = (e) => {
    const value = e.target.value
    const allowed = /^[0-9\b]+$/;

    if (e.target.value === '' || allowed.test(e.target.value)) {
    this.setState({
      currentBudget: value
    });
    }
  }

  handleAlternate = (e) => {
    e.preventDefault()
    var currentBudget = this.state.currentBudget
    this.setState({
      budgets: {  budget: currentBudget }
    })
  };

  render() {
    return (
      <div className='main'>

        <header>

        <img src='./banner.jpeg'  width="350"
            height="100"></img>

          <h3>{this.state.date}</h3>
        </header>
        <form>
        <label>
            Enter Budget:
          <input name = "budget" onChange={this.handleBudgetChange} type="number" value={this.state.currentBudget} />
        </label>
          <button onClick={this.handleAlternate.bind(this)}>Add Budget</button>
      </form>

      <div>
      <p> <b>{this.getCurrentMonth()}'s Budget: </b><div className='budgetText'>${this.state.budgets.budget}.00</div></p>
      </div>

      <div>
        <Budget currentBudget={this.state.currentBudget}/>
      </div>

      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));