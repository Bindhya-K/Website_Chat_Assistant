from sentence_transformers import SentenceTransformer
MODEL_NAME = "sentence-transformers/paraphrase-MiniLM-L3-v2"

print("Downloading embedding model")

SentenceTransformer(MODEL_NAME)

print("Embedding model downloaded")