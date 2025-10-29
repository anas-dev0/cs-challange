import PyPDF2
import docx
# import easyocr
import os

# Initialize the OCR reader.
# This will download the necessary models the first time it's run.
# It will automatically use the GPU if a CUDA-enabled PyTorch is installed.
print("Initializing EasyOCR reader...")
# reader = easyocr.Reader(['en']) # 'en' for English
print("EasyOCR reader initialized.")

def extract_text_from_cv(file_path: str) -> str:
    """
    Extracts text from a CV file (PDF, DOCX, PNG, JPG).
    It uses OCR for image-based files.
    """
    _, extension = os.path.splitext(file_path)
    extension = extension.lower()
    text = ""
    print(f"Processing file: {file_path} with extension: {extension}")

    if extension == ".pdf":
        try:
            # Extract text from PDF using PyPDF2
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text()
        except Exception as e:
            print(f"Error processing PDF with PyPDF2: {e}")
            return ""

    elif extension == ".docx":
        try:
            doc = docx.Document(file_path)
            for para in doc.paragraphs:
                text += para.text + "\n"
        except Exception as e:
            print(f"Error processing DOCX: {e}")
            return ""

    elif extension in [".png", ".jpg", ".jpeg"]:
        try:
            # Use EasyOCR for image files
            ocr_results = reader.readtext(file_path, detail=0, paragraph=True)
            text = "\n".join(ocr_results)
        except Exception as e:
            print(f"Error processing image with EasyOCR: {e}")
            return ""

    else:
        print(f"Unsupported file type: {extension}")
        return ""

    print(f"Successfully extracted {len(text)} characters.")
    return text