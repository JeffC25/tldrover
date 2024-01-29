from fastapi import APIRouter, HTTPException, UploadFile, File
from app.api.schemas import ExtractResponse
import pypdf

router = APIRouter()

def parsePDF(file):
    try:
        pdf = pypdf.PdfFileReader(file)
        content = ""
        for page in pdf.pages:
            content += page.extractText()
        return content
    except Exception as e:
        print(e)
        raise e

@router.post("/file",  response_model=ExtractResponse)
async def fild(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="File is required.")

    try: 
        content = parsePDF(file)
        if content == "":
            raise HTTPException(status_code=500, detail="Could not extract text from the file.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return ExtractResponse(content=content)