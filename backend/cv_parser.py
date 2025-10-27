import fitz  # PyMuPDF
import docx
import easyocr
import os

# Initialize the OCR reader.
# This will download the necessary models the first time it's run.
# It will automatically use the GPU if a CUDA-enabled PyTorch is installed.
print("Initializing EasyOCR reader...")
reader = easyocr.Reader(['en']) # 'en' for English
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
            # First, try to extract text directly (for text-based PDFs)
            doc = fitz.open(file_path)
            for page in doc:
                text += page.get_text()
            doc.close()

            # If text is very short, it might be a scanned PDF. Fallback to OCR.
            if len(text.strip()) < 100:
                print("PDF seems to be image-based. Falling back to OCR.")
                text = "" # Reset text
                doc = fitz.open(file_path)
                for i, page in enumerate(doc):
                    pix = page.get_pixmap(dpi=300) # Render page to an image
                    img_bytes = pix.tobytes("png")
                    ocr_results = reader.readtext(img_bytes, detail=0, paragraph=True)
                    text += "\n".join(ocr_results)
                doc.close()
        except Exception as e:
            print(f"Error processing PDF with PyMuPDF: {e}")
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