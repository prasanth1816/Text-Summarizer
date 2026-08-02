# 📝 Text Summarizer using T5 Transformer

A web-based Text Summarization application built using **FastAPI**, **Hugging Face Transformers**, and a fine-tuned **T5 Transformer** model. The application generates concise summaries from long pieces of text through a simple and interactive web interface.

---

## 🚀 Features

- Generate summaries from long text instantly.
- Fine-tuned T5 Transformer model.
- FastAPI backend.
- Clean HTML, CSS, and JavaScript frontend.
- REST API for text summarization.
- GPU/CPU support using PyTorch.

---

## 🛠️ Tech Stack

### Backend
- Python
- FastAPI
- PyTorch
- Hugging Face Transformers
- Pydantic

### Frontend
- HTML
- CSS
- JavaScript

### Model
- T5 Transformer
- Fine-tuned on the SAMSum Dataset

---

## 📂 Project Structure

```
Text_Summarizer/
│── app.py
│── templates/
│   └── index.html
│── static/
│   ├── style.css
│   └── script.js
│── final_model/          # Local model (Not uploaded to GitHub)
│── TextSummarizer.ipynb
│── samsum-train.csv
│── samsum-test.csv
│── samsum-validation.csv
│── .gitignore
│── README.md
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/prasanth1816/Text-Summarizer.git
```

```bash
cd Text-Summarizer
```

---

### Create Virtual Environment

Windows

```bash
python -m venv .venv
```

Activate

```bash
.venv\Scripts\activate
```

---

### Install Dependencies

```bash
pip install fastapi
pip install uvicorn
pip install torch
pip install transformers
pip install sentencepiece
pip install jinja2
```

or

```bash
pip install -r requirements.txt
```

---

## ▶️ Run the Application

```bash
python -m uvicorn app:app --reload
```

Open your browser and visit

```
http://127.0.0.1:8000
```

---

## 📡 API Endpoint

### POST `/summarize/`

#### Request

```json
{
  "dialogue": "Enter your text here..."
}
```

#### Response

```json
{
  "summary": "Generated summary..."
}
```

---

## 📊 Dataset

The model is fine-tuned using the **SAMSum Dialogue Summarization Dataset**.

---

## 📌 Model

The trained model is **not included** in this repository because GitHub has a file size limit of **100 MB**.

Place the downloaded model inside:

```
final_model/
```

before running the application.

---

## 📷 Screenshots

Add screenshots of your application here.

Example:

- Home Page
- Generated Summary

---

## 🔮 Future Improvements

- User Authentication
- Multiple Summarization Models
- PDF and DOCX Summarization
- File Upload Support
- Deployment on Render/AWS
- Model Download from Hugging Face

---

## 👨‍💻 Author

**Prasanth Guntreddi**

GitHub: https://github.com/prasanth1816

LinkedIn: *(Add your LinkedIn URL)*

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
