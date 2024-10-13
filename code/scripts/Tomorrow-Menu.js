class UpdateMenu {
  getMenu(menu) {
    this.mealPlan = menu;
    
    let today = new Date();
    let tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    let tomorrowDay = (tomorrow.getDay() - 1 + 7) % 7;

    let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    let currentWeek = Math.floor((today - firstDayOfMonth) / 604800000);
    if (currentWeek < 0) {
      currentWeek = 3;
    } else {
      currentWeek %= 4;
    }
    
    let todayDay = (today.getDay() - 1 + 7) % 7;
    let tomorrowWeek
    if (todayDay === 6) {
      tomorrowWeek = currentWeek + 1;
    } else {
      tomorrowWeek = currentWeek
    }

    if(tomorrowWeek >=4 ) tomorrowWeek = 0;

    let hostelSelect = document.getElementById("hostel").value;
    if (hostelSelect === "S-LH 1-4") {
      tomorrowWeek = (tomorrowWeek + 1) % 4;
    }
    
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    let actualDay = days[tomorrowDay];

    let week = document.getElementById("week");
    week.innerHTML = `Week: ${tomorrowWeek + 1}`;

    let day = document.getElementById("day");
    day.innerHTML = `Day: ${actualDay}`;

    let menuForTomorrow = menu.weeks[tomorrowWeek].days[tomorrowDay];

    // Update the UI with the menu for tomorrow
    let id1 = document.getElementById("breakfast");
    id1.innerHTML = `${menuForTomorrow.BREAKFAST.toLowerCase()}`;

    let id2 = document.getElementById("lunch");
    id2.innerHTML = `${menuForTomorrow.LUNCH.toLowerCase()}`;

    let id3 = document.getElementById("snacks");
    id3.innerHTML = `${menuForTomorrow.SNACKS.toLowerCase()}`;

    let id4 = document.getElementById("dinner");
    id4.innerHTML = `${menuForTomorrow.DINNER.toLowerCase()}`;
  }

  updateMenu(menu) {
    this.getMenu(menu);
    this.scheduleNextUpdate(menu);
  }

  scheduleNextUpdate(menu) {
    let now = new Date();
    let midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0
    );
    let timeUntilMidnight = midnight - now;

    setTimeout(() => {
      this.getMenu(menu);
      this.scheduleNextUpdate(menu);
    }, timeUntilMidnight);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  let hostelSelect = document.getElementById("hostel");
  let previousHostel = localStorage.getItem("selectedHostel");

  if (previousHostel) hostelSelect.value = previousHostel;
  else hostelSelect.value = "S-BH 1-12"; // default value
  hostelSelect.dispatchEvent(new Event("change"));
});

let tomorrowLabel = document.getElementById("menu-tom");
tomorrowLabel.addEventListener("click", () => {
  let hostelSelect = document.getElementById("hostel");
  let selectedHostel = hostelSelect.value;
  localStorage.setItem("selectedHostel", selectedHostel);

  let asideElement = document.querySelector(".menu-pic");
  asideElement.classList.add("loading");

  let xhr = new XMLHttpRequest();
  xhr.open("GET", `../menu/${selectedHostel}.json`, true);

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      let menu = JSON.parse(xhr.responseText);
      // Update the menu display
      let update = new UpdateMenu();
      update.updateMenu(menu); // Call the updateMenu method
      asideElement.classList.remove("loading");
    } else {
      console.log("Error fetching the data: ", xhr.statusText);
    }
  };

  xhr.onerror = () => {
    console.log("Error fetching the data: ", xhr.statusText);
  };

  xhr.send();
});
