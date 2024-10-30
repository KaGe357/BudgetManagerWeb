document.addEventListener("DOMContentLoaded", function () {
    const incomeCtx = document.getElementById("incomeChart").getContext("2d");
    const expenseCtx = document.getElementById("expenseChart").getContext("2d");
  
    let incomeChart;
    let expenseChart;
  
    function initializeChart(ctx, data, title) {
      return new Chart(ctx, {
        type: "pie",
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: title,
            },
          },
        },
      });
    }
  
    let incomes = JSON.parse(localStorage.getItem("dochody")) || [];
  
    const expenseData = {
      labels: ["Żywność", "Transport", "Rozrywka", "Inne"],
      datasets: [
        {
          data: [1200, 800, 400, 300],
          backgroundColor: ["#FF5252", "#FF7043", "#FF8A65", "#FFAB91"],
        },
      ],
    };
  
    function createCharts() {
      if (incomeChart) incomeChart.destroy();
      if (expenseChart) expenseChart.destroy();
  
      incomeChart = initializeChart(
        incomeCtx,
        {
          labels: [],
          datasets: [
            {
              data: [],
              backgroundColor: ["#4CAF50", "#66BB6A", "#81C784", "#A5D6A7"],
            },
          ],
        },
        "Dochody"
      );
      expenseChart = initializeChart(expenseCtx, expenseData, "Wydatki");
    }
  
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];
  
    document.getElementById("startDate").value = startDateStr;
    document.getElementById("endDate").value = endDateStr;
  
    createCharts();
    updateCharts(startDateStr, endDateStr);
  
    function applyDateRange() {
      const startDate = document.getElementById("startDate").value;
      const endDate = document.getElementById("endDate").value;
  
      if (new Date(startDate) > new Date(endDate)) {
        alert("Data początkowa nie może być późniejsza niż data końcowa.");
        return;
      }
  

  
      updateCharts(startDate, endDate);
      document.getElementById("balanceModal").style.display = "none";

    }
  
    //document.getElementById("applyDateRange").addEventListener("click", applyDateRange);

    function updateCharts(startDate, endDate) {
      const filteredIncomes = incomes.filter((d) => {
        const data = new Date(d.data);
        return data >= new Date(startDate) && data <= new Date(endDate);
      });
  
      const incomesCategory = {
        Wynagrodzenie: 0,
        "Sprzedaż na portalach aukcyjnych": 0,
        "Odsetki bankowe": 0,
        Inne: 0,
      };
  
      filteredIncomes.forEach((d) => {
        if (incomesCategory.hasOwnProperty(d.kategoria)) {
          incomesCategory[d.kategoria] += d.kwota;
        } else {
          incomesCategory["Inne"] += d.kwota;
        }
      });
      
  
      incomeChart.data.labels = Object.keys(incomesCategory);
      incomeChart.data.datasets[0].data = Object.values(incomesCategory);
      incomeChart.update();
  
      document.getElementById("salary").textContent =
        incomesCategory["Wynagrodzenie"] || 0;
      document.getElementById("interest").textContent =
        incomesCategory["Odsetki bankowe"] || 0;
      document.getElementById("sale").textContent =
        incomesCategory["Sprzedaż na portalach aukcyjnych"] || 0;
      document.getElementById("otherIncomes").textContent =
        incomesCategory["Inne"] || 0;
      document.getElementById("food").textContent =
        expenseData.datasets[0].data[0];
      document.getElementById("transport").textContent =
        expenseData.datasets[0].data[1];
      document.getElementById("pastime").textContent =
        expenseData.datasets[0].data[2];
      document.getElementById("otherExpenses").textContent =
        expenseData.datasets[0].data[3];
    }
  });
  