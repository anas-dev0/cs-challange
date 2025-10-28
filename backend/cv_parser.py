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
    text = """khaoula Mechria
 Etudiante ingénieur en TIC
 Profil
 Étudiante entrepreneure (Peec niveau 1)
 passionnée par la  programmation et la
 résolution de problèmes. Curieuse, motivé et
 toujours prêt à apprendre, je m’intéresse au
 fonctionnement des systèmes intelligents et à la
 création de solutions innovantes à fort impact.
 Formation
 Cycle d'Ingénieur | 2024 - 2025
 École Supérieure des Communications de
 Tunis | Tunis
 Cycle Préparatoire physique-chimie| 2022 
2024
 Institut Préparatoire aux Études d'Ingénieurs
 de Monastir | 73ᵉ rang à l'échelle nationale
 Baccalauréat en Mathématique | 2022 Avec
 mention trés bien
 Certification- fundamentals of deep learning by Invidia-web scrapping datacamp.-ccna1 _Introduction to Networks-Traitement de signal et image MATLAB
 Langue
 Arabe (langue maternelle)
 Francais
 Anglais 
Projets académiques
 BridgeToKnowledge”,Projet collaboratif réalisé dans
 le cadre du programme PACTE de SUP’COM:Ce
 projet vise à développer une initiative citoyenne ou
 sociale à impact positif.(création d’une librairie au
 sein d’un collége).
 vhdl UAL: implémentation des bases du vhdl
 SUP’Museum :projet base de données qui vise à
 renforcer la visibilités des musées et améliorer
 l’expérience des visiteurs.
 Projet c++ hotel management 
Vie associative-IEEE SB SUP'COM (participation en TSYP)-ACM (competitive programming club)-MLS -Team Supcom commité design
 Compétences techniques
 Langages de programmation : C++ (data
 structure,POO),Python(bases,
 PyTorch, Numpy, Pandas ,Matplotlib,
 POO...),
 base en:
 VHDL.
 MySQL +PowerBI
 Linux 
MATLAB
 Contact
 +216 29297249
 khaoula.mechria@supcom.tn"""
    
    return text

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