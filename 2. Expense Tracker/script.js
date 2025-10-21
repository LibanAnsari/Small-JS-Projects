const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionFormEl.addEventListener("submit", addTransaction);

function addTransaction(e){
    e.preventDefault();

    // get form values
    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value);

    transactions.push({ // update in local code
        id:Date.now(),
        description,
        amount
    })
    
    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateTransactionList(); // update in UI
    updateSummary();

    transactionFormEl.reset(); // reset the form for new entries
}

function updateTransactionList(){
    transactionListEl.innerHTML = "";

    const sortedTransactions = [...transactions].reverse();

    sortedTransactions.forEach((transaction) =>{
        transactionEl = createTransactionEl(transaction);
        transactionListEl.appendChild(transactionEl);
        
    })

}

function createTransactionEl(transaction){
    const li = document.createElement("li");
    li.classList.add("transaction");
    li.classList.add(transaction.amount > 0 ? "income" : "expense");

    li.innerHTML = `
        <span>${transaction.description}</span>
        <span>${formatCurrency(transaction.amount)}
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        </span>
    `

    return li;
}

function updateSummary(){
    const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

    const income = transactions.filter(transaction => transaction.amount > 0).reduce((acc, transaction) => acc + transaction.amount, 0);
    
    const expense = transactions.filter(transaction => transaction.amount < 0).reduce((acc, transaction) => acc + transaction.amount, 0);

    // update ui
    balanceEl.textContent = formatCurrency(balance);
    incomeAmountEl.textContent = formatCurrency(income);
    expenseAmountEl.textContent = formatCurrency(expense);
}

function formatCurrency(number){
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(number);
}


function removeTransaction(id){
    // filter out the one we want to delete
    transactions = transactions.filter(transaction => transaction.id !== id);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    // update ui
    updateTransactionList();
    updateSummary();
}

// initial render/refresh
updateTransactionList();
updateSummary();