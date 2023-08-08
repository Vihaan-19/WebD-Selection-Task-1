//fetch api from the link
fetch("https://test-data-gules.vercel.app/data.json")
  .then((res) => res.json())
  .then((api) => {
    //We will add Question Categories in this search array
    var search_arr = [];
    //Id array will store the ids of the question categories
    var id_arr = [];

    // Counters for checkbox (representing checked and unchecked states)
    var ctr1 = 0;
    var ctr2 = 0;

    var data_arr = api.data;

    //For Progress Bar
    var nowQuestionSolved = 0;
    var prevTotalQuestionSolved = 0;
    var totalQuestions = 0;

    data_arr.forEach((element) => {
      var ques_arr = element.ques;
      createm(element);

      //Fetching the category (main title)
      function createm(element) {
        var h1 = document.createElement("h1");
        h1.textContent = element.sl_no + ". " + element.title;
        h1.setAttribute("class", "main-title");
        document.body.appendChild(h1);
      }

      ques_arr.forEach((ele) => {
        //Created a div which contains entire question
        var question = document.createElement("div");
        question.setAttribute("class", "ques-container");
        document.body.appendChild(question);
        createq(ele, question);

        function createq(ele, question) {
          //Creating a div for question title and tags
          var quesDiv = document.createElement("div");
          quesDiv.setAttribute("class", "ques-header");
          question.appendChild(quesDiv);

          //Adding question title
          var h2 = document.createElement("h2");
          h2.textContent = ele.title;

          //pushed title to search_arr
          search_arr.push(ele.title);
          //pushed id to id array
          id_arr.push(ele.id);

          h2.setAttribute("class", "ques-header ques-title");
          h2.setAttribute("id", ele.id);
          quesDiv.appendChild(h2);

          //Adding Tags
          if (ele.tags != "") {
            var tags = ele.tags.split(",");
            console.log(tags);

            var tagContainer = document.createElement("div");
            tagContainer.setAttribute("class", "tag-container");
            quesDiv.appendChild(tagContainer);

            tags.forEach((tag) => {
              var tagDiv = document.createElement("div");
              tagDiv.setAttribute("class", "tag-div");
              tagContainer.appendChild(tagDiv);

              var p = document.createElement("p");
              p.textContent = tag;
              p.setAttribute("class", "ques-header tags");
              tagDiv.appendChild(p);
            });
          }

          //Adding accordion icons
          var icon = document.createElement("i");
          icon.setAttribute("class", "fa-solid fa-plus fa-xl");
          quesDiv.appendChild(icon);
        }
        //Creating an answer div
        var answer = document.createElement("div");
        answer.setAttribute("class", "answer");
        question.appendChild(answer);

        if (ele.p1_link != null) {
          ctr1++;
          //Creating problem1 div checkbox and link
          var p1 = document.createElement("div");
          p1.setAttribute("class", "answer p1");
          answer.appendChild(p1);

          var input = document.createElement("input");
          input.setAttribute("class", "answer my-check-box-1");
          input.setAttribute("id", ctr1 + "a");
          input.setAttribute("type", "checkbox");

          p1.appendChild(input);
          createy(ele.p1_link, "Problem1 ", "answer p1-link", p1);

          //Adding Book-Mark icon
          var bookmark = document.createElement("button");
          bookmark.innerHTML = '<i class="fa-regular fa-bookmark"></i>';
          bookmark.setAttribute("class", "bookmark-btn");
          //See id carefully
          bookmark.setAttribute("id", ele.title + "<>" + ele.p1_link);
          p1.appendChild(bookmark);
        }

        if (ele.p2_link != null) {
          ctr2++;
          //Creating problem2 div which contains checkbox and link
          var p2 = document.createElement("div");
          p2.setAttribute("class", "answer p2");
          answer.appendChild(p2);

          var input = document.createElement("input");
          input.setAttribute("class", "answer my-check-box-2");
          input.setAttribute("id", ctr2 + "b");
          input.setAttribute("type", "checkbox");

          p2.appendChild(input);
          createy(ele.p2_link, "Problem2 ", "answer p2-link", p2);

          //Adding Book-Mark icon
          var bookmark2 = document.createElement("button");
          bookmark2.innerHTML = '<i class="fa-regular fa-bookmark"></i>';
          bookmark2.setAttribute("class", "bookmark-btn");
          //See id carefully
          bookmark2.setAttribute("id", ele.title + "<>" + ele.p2_link);
          p2.appendChild(bookmark2);
        }

        if (ele.yt_link != null)
          createy(ele.yt_link, "Youtube ", "answer yt-link", answer);

        function createy(url, name, className, Div) {
          var a = document.createElement("a");
          a.textContent = name;

          a.setAttribute("href", url);
          a.setAttribute("class", className);
          Div.appendChild(a);
        }
      });
    });

    // Accordion
    if (document.querySelectorAll(".ques-container").length) {
      console.log("ready!");
      const accordionItems = document.querySelectorAll(".ques-container");

      // Add click event listener to each accordion header
      accordionItems.forEach((item) => {
        const header = item.querySelector(".ques-header");

        header.addEventListener("click", () => {
          // Toggle the active class to expand/collapse the content
          item.classList.toggle("active");
          // Close other accordion items if they are open
          accordionItems.forEach((accordionItem) => {
            if (
              accordionItem !== item &&
              accordionItem.classList.contains("active")
            ) {
              accordionItem.classList.remove("active");
            }
          });
        });
      });
    }

    // Search Feature
    if (search_arr.length) {
      const searchInput = document.getElementById("searchInput");
      const searchButton = document.getElementById("searchButton");
      const searchResults = document.getElementById("searchResults");

      function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = search_arr.filter((item) =>
          item.toLowerCase().includes(searchTerm)
        );

        // Clear previous search results
        searchResults.innerHTML = "";

        var ctr = 0;

        if (filteredData.length === 0)
          searchResults.innerHTML = "<li>No results found</li>";
        else if (filteredData.length != search_arr.length) {
          filteredData.forEach((item) => {
            const listItem = document.createElement("li");
            // listItem.textContent = item;
            searchResults.appendChild(listItem);

            //Adding a href
            data_arr.forEach((q) => {
              q.ques.forEach((ele) => {
                if (ele.title == item) {
                  const jumpAnchor = document.createElement("a");
                  jumpAnchor.textContent = item;
                  jumpAnchor.setAttribute("href", "#" + ele.id);
                  listItem.appendChild(jumpAnchor);
                }
              });
            });
          });
        }
      }
      searchButton.addEventListener("click", performSearch);
      searchInput.addEventListener("keyup", performSearch);
    }

    // Checkbox-1 Feature
    const problem1 = document.querySelectorAll(".p1");
    const problem2 = document.querySelectorAll(".p2");
    totalQuestions = problem1.length + problem2.length;
    console.log(totalQuestions);
    problem1.forEach((check) => {
      const myBox = check.querySelector(".my-check-box-1");
      myBox.addEventListener("change", function () {
        if (myBox.checked) {
          localStorage.setItem(myBox.id, "1");
          check.style.backgroundColor = "#3D8361";
          nowQuestionSolved++;
          updateMyProgressBar(
            prevTotalQuestionSolved + nowQuestionSolved,
            totalQuestions
          );
        } else {
          localStorage.setItem(myBox.id, "0");
          check.style.backgroundColor = "#6F61C0";
          nowQuestionSolved--;
          updateMyProgressBar(
            prevTotalQuestionSolved + nowQuestionSolved,
            totalQuestions
          );
        }
      });

      if (localStorage.getItem(myBox.id) === "1") {
        console.log("Checked");
        check.style.backgroundColor = "#3D8361";
        myBox.checked = true;

        //Updating the number of solved questions
        prevTotalQuestionSolved++;
        updateMyProgressBar(
          prevTotalQuestionSolved + nowQuestionSolved,
          totalQuestions
        );
      } else {
        console.log("Unchecked");
        check.style.backgroundColor = "#6F61C0";
        myBox.checked = false;
        // localStorage.setItem("isChecked1","0");
      }
    });

    // Checkbox-2 Feature
    problem2.forEach((check) => {
      const myBox = check.querySelector(".my-check-box-2");

      // console.log(localStorage.getItem("isChecked2"));
      myBox.addEventListener("change", function () {
        if (myBox.checked) {
          localStorage.setItem(myBox.id, "1");
          check.style.backgroundColor = "#3D8361";
          nowQuestionSolved++;
          updateMyProgressBar(
            prevTotalQuestionSolved + nowQuestionSolved,
            totalQuestions
          );
        } else {
          localStorage.setItem(myBox.id, "0");
          check.style.backgroundColor = "#6F61C0";
          nowQuestionSolved--;
          updateMyProgressBar(
            prevTotalQuestionSolved + nowQuestionSolved,
            totalQuestions
          );
        }
      });

      if (localStorage.getItem(myBox.id) === "1") {
        console.log("Checked");
        check.style.backgroundColor = "#3D8361";
        myBox.checked = true;

        prevTotalQuestionSolved++;
        updateMyProgressBar(
          prevTotalQuestionSolved + nowQuestionSolved,
          totalQuestions
        );
      } else {
        console.log("Unchecked");
        check.style.backgroundColor = "#6F61C0";
        myBox.checked = false;
      }
    });

    //Function to update Progress Bar
    function updateMyProgressBar(totalQuestionSolved, totalQuestions) {
      var percentage = Math.round((totalQuestionSolved / totalQuestions) * 100);
      var progress = document.querySelector(".progress");
      var percentProgress = document.querySelector(".percent");
      console.log(percentage);
      progress.style.width = percentage + "%";
      percentProgress.innerHTML = percentage + "%";
    }





    //Book-Mark Feature
    var bkmk_arr = document.querySelectorAll(".bookmark-btn");
    var bookmarkedProblems = { title: [], ids: [] };

    if (localStorage.getItem("myProblems")) {
      var bookmarkedProblems = JSON.parse(localStorage.getItem("myProblems"));

      bkmk_arr.forEach((bmk) => {
        var Info = bmk.getAttribute("id").split("<>");
        var Link = Info[1];
        if (
          bookmarkedProblems.ids.find((str) => {
            return str == Link;
          })
        ) {
          //If book-mark found
          console.log("found");
          document.getElementById(bmk.getAttribute("id")).innerHTML =
            '<i class="fa-solid fa-bookmark"></i>';
        } else {
          //If not found
          console.log("Not found");
          document.getElementById(bmk.getAttribute("id")).innerHTML =
            '<i class="fa-regular fa-bookmark"></i>';
        }
      });
    }

    bkmk_arr.forEach((bmk) => {
      bmk.addEventListener("click", () => {
        var embeddedInfo = bmk.getAttribute("id").split("<>");
        var embeddedTitle = embeddedInfo[0];
        var embeddedLink = embeddedInfo[1];

        //Search for id
        //If not found -->Store
        if (
          !bookmarkedProblems.ids.find((str) => {
            return str == embeddedLink;
          })
        ) {
          console.log(embeddedLink);
          bookmarkedProblems.title.push(embeddedTitle);
          bookmarkedProblems.ids.push(embeddedLink);
          localStorage.setItem(
            "myProblems",
            JSON.stringify(bookmarkedProblems)
          );

          document.getElementById(bmk.getAttribute("id")).innerHTML =
            '<i class="fa-solid fa-bookmark"></i>';
          console.log("Click Not found and added");
        }
        //If found, delete
        else {
          console.log("Click found");
          document.getElementById(bmk.getAttribute("id")).innerHTML =
            '<i class="fa-regular fa-bookmark"></i>';
        }
      });
    });
  });

//Dark Mode feature
function darkmode() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}
