from fastapi import FastAPI,HTTPException
from pydantic import BaseModel
from langchain_community.document_loaders import WebBaseLoader
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

load_dotenv()

# constants
MODEL_NAME = 'llama-3.1-8b-instant'
EMBEDDING_MODEL='sentence-transformers/all-MiniLM-L6-v2'
CHUNK_SIZE=1000
CHUNK_OVERLAP=200

app=FastAPI()
llm =ChatGroq(model = MODEL_NAME)

#global variables to store chunks and embeddings
vector_store = None
retriever = None
page_title = ""
embeddings = None
def get_embeddings():
    global embeddings

    if embeddings is None:
        embeddings = HuggingFaceEmbeddings(
            model_name=EMBEDDING_MODEL
        )

    return embeddings


prompt = PromptTemplate(
    template="""
You are a helpful AI assistant.

Answer ONLY using the website content provided below.

If the answer is not available in the website content,
reply exactly:

"I couldn't find that information on this webpage."

Website Content:
{context}

Question:
{question}

Answer:
""",
    input_variables=["context", "question"]
)

parser = StrOutputParser()
chain = prompt|llm|parser


class WebsiteIndexRequest(BaseModel):
    url:str
class QuestionRequest(BaseModel):
    question:str



@app.get("/")
def home():
    return{
        "status":"Healthy",
        "service": "Website Chat Assistant"
    }


@app.post("/index")
def index_website(data: WebsiteIndexRequest):
    global vector_store, retriever, page_title
    # loading website
    try:
        print("1. Starting Loader")
       
        loader = WebBaseLoader(data.url)
        
        docs = loader.load()
        print("2.Website loaded")
        #extracting document
        
        document = docs[0]
        page_title = document.metadata.get("title")
        

        # splitting the document
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE,
            chunk_overlap=CHUNK_OVERLAP
        )    
        
        chunks = splitter.split_documents(docs)
        print("3. Splitting completed")
        print("chunks",len(chunks))

        
        vector_store = Chroma.from_documents(
            documents=chunks,
            embedding=get_embeddings()
        )
        print("4.vector store created")
        retriever = vector_store.as_retriever()
        
        #return answer
        return{
        "message": "Website indexed successfully",
        "title": page_title,
        "chunks": len(chunks)
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@app.post('/ask')
def ask_question(data:QuestionRequest):
    global retriever, page_title

    if retriever is None:
        raise HTTPException(
            status_code=400,
            detail="Please index a website first"
        )

    retrieved_docs = retriever.invoke(data.question)
    context = "\n\n".join(doc.page_content for doc in retrieved_docs)

    #asking LLM
    answer = chain.invoke({
        'context':context,
        'question':data.question
    })
    return {
        "title":page_title,
        "question":data.question,
        "answer":answer
    }
    




    