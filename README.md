# Website Chat Assistant
It is an an AI powered chrome extension that let's you chat with the webpage you're currently viewing.
Instead of manually searching throughlong articles, documentation or product pages, you can simply ask a 
question in plain English and get an answer based on the content of that page. The project is built using RAG.
Rather than sending entire webpage  to the language model, it retrieves only the most relevant sections of the page before 
generating an answer.This makes the reponse more accurate and reduces unnecessary processing.

## Why I built this?
i often found myself spending a lot of time searching through long webpages to find  small specific information.
Whether a documentation, blogs or technical articles, locating a piece of information is frustating.
I built this project to solve this. The extension reads the current page, indexes its content and allows the user 
to ask question directly fromt he browser.

## Features
* Automatically indexes the webpage you're currently viewing.
* Ask questions in natural language.
* Retrieves only the relevant content using RAG
* Generates answer with Groq's Llama 3.1 model
* Simple and lightweight Chrome Extension interface

## Tech Stack
### Backend
- Python
- FastAPI
- LangChain
- HuggingFace Embeddings
- Chroma Vector Database
- Groq LLM
- BeautifulSoup

### Frontend
- HTML
- CSS
- JavaScript
- Chrome Extension
## How it works?

1. When the extension opens , it sends  the URL of the active browser tab to FASTAPI backend.
2. The backend loads the webpage using LangChain's Webbasedloader
3. The webpage is split into chunks
4. Each chunk is converted into embedding vectors using all-MiniLM-L6-v2 model
5. The embedding vectors  are stored in Chroma vector database.
6. When a user asks a question, the retriever searches in the vector database and retrieves the most 4 relevant chunks
7. These chunks along with user's question are passed as prompt to LLM 
8. The LLM generates the answer and is displayed in chrome extension to user

## Project Structure
```text
Website-Chat-Assistant/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── .env
│
├── extension/
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.css
│   ├── popup.js
│   ├── background.js
│   └── icons/
│
├── Screenshots/
│   ├── error.png
│   ├── indexed.png
│   ├── indexing.png
│   └── Q&A.png
││
├── README.md
│
└── .gitignore
```
## Getting Started
### 1. Cone the repository
```bash
git clone https://github.com/Bindhya-K/Website_Chat_Assistant.git
```

### 2. Install the backend dependencies

```bash
cd backend
pip install -r requirements.txt 
```
### 3. Add your API key

Create a '.env' file inside the backend  folder and add
GROQ_API_KEY = your api key here

### 4.  Start the backend
```bash
uvicorn app:app --reload
```
### 5. Load the chrome extension

- Open Chrome and navigate to `chrome://extensions`
- Enable "Developer Mode"
- Click "Load unpacked"
- Select the `extension` folder

The extension is now ready to use

## Screenshots
### Website indexing
When we first open  the chrome extension , it show "indexing the website"
![Website Indexing](/Screenshots/indexing.png)
### Website indexed
After indexing, title of webpage is diplayed on chrome extension
![Website Indexed](/Screenshots/indexed.png)
### Asking Question and Displaying Answer
![Question & Answer](/Screenshots/Q&A.png)
### Error Handling
When Ask button is clicked without entering question in questions bar, an error message is displayed.
![Error Handling](/Screenshots/error.png)
## Future improvements
Although the extension works well for static webpages content, there are still a few improvements that could be included.
One limitation of the this project is it only indexes the HTML available when the  page first loads. Many websites render additional content dynamically using JavaScript, so as a fututre improvement, I'd like use Selenium or playwright or similar browser automation tools to capture and index that content as well.
Also a memory block can be added  so that the assistant can remember previous questions within the same conversation. This could make follow-up questions feel much more natural and create a better overall  user experience.

## What I learned

It helped me gain hands-on experience and how RAG work end-to-end from loading webpages, generating embeddings, promplt engineering, and integrating an LLM into a real application. It also helped me strengthen my understanding of FastAPI, asynchronous JavaScript, Chrome Extension development, API communication and error handling in production-style applications.

## About the Author

I'm current learning Data Science and generative AI while building practical projects to strengthen my understanding of ML, LLM and AI applications. 
If you'd like to connect , feel free to reach out on LinkedIn.
