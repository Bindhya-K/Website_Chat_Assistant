const questionBox = document.getElementById('question')
const askBtn = document.getElementById('askBtn')
const answerBox = document.getElementById('answer')
const EMPTY_QUESTION_MESSAGE = "Please enter a question"
const API_URL = "http://127.0.0.1:8000"



questionBox.addEventListener('input',function () {
    questionBox.classList.remove('error');
    if (answerBox.innerText === EMPTY_QUESTION_MESSAGE){
        answerBox.innerText="";
    }
});

async function indexWebsite() {
    answerBox.innerText = "Indexing Website ...";
    const tabs = await chrome.tabs.query({
        active:true,
        currentWindow:true
    })
    const currentTab = tabs[0];
    const web = {
        url : currentTab.url
    }
    try {
        const response = await fetch(`${API_URL}/index`,{
            method:"POST",
            headers :{
                'Content-Type':'application/json'
            },
            body : JSON.stringify(web)
        });

        const result = await response.json();
        const title =
        result.title.length > 35
            ? result.title.substring(0, 35) + "..."
            : result.title;
        answerBox.innerText = 
        `Website Indexed
        
        Title :${result.title}

        Indexed ${result.chunks} chunks`;
    }
    catch {
        answerBox.innerText = "Server not working";
    }
    finally {
        askBtn.disabled = false;
    }
}
async function askQuestion() {
    const question = questionBox.value.trim()
    const data = {
        question
        }
    
    if (!question) {
        answerBox.innerText = EMPTY_QUESTION_MESSAGE;
        questionBox.classList.add('error');
        return;
    }
    askBtn.disabled = true;
    questionBox.disabled = true;
    answerBox.innerText = "Loading ...";
    try {
        const response = await fetch(`${API_URL}/ask`,{
            method : "POST",
            headers : {
                "Content-Type":"application/json"
            },
            body : JSON.stringify(data)
        }); 
        if(!response.ok) {
            const error = response.json;
            if (response.status===400){
                answerBox.innerText = error.detail
            }
            else if (response.status===500){
                answerBox.innerText = "Something went wrong. Please try again"
            }
            else {
                answerBox.innerText = "Unexpected error"
            }
            return;
            
        }
        const result = await response.json();
        answerBox.innerText = result.answer;
        questionBox.value="";
       
    }
    catch {
        answerBox.innerText = "Server not working";
    }
    finally {
        askBtn.disabled = false;
        questionBox.disabled =false;
        questionBox.focus();
}
}
// Button click

askBtn.addEventListener("click", askQuestion);
questionBox.addEventListener('keydown',function (event){
    if (event.key==='Enter'){
        askQuestion();
    }
})

// Automatically index website

    indexWebsite();


/*

const answerBox = document.getElementById("answer");
const questionInput = document.getElementById("question");
const askBtn = document.getElementById("askBtn");

// Runs automatically when popup opens
async function indexWebsite() {

    answerBox.innerText = "Indexing website...";

    const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    const currentTab = tabs[0];

    const response = await fetch("http://127.0.0.1:8000/index", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            url: currentTab.url
        })

    });

    const data = await response.json();

    answerBox.innerText = "✅ Website Ready!";
}

// Runs when Ask button is clicked
async function askQuestion() {

    const question = questionInput.value;

    if (question.trim() === "") {
        answerBox.innerText = "Please enter a question.";
        return;
    }

    answerBox.innerText = "Thinking...";

    const response = await fetch("http://127.0.0.1:8000/ask", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            question: question
        })

    });

    const data = await response.json();

    answerBox.innerText = data.answer;
}


*/