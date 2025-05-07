import io

import pypdf
from app.api.schemas import ExtractResponse
from fastapi import APIRouter, File, HTTPException, UploadFile

router = APIRouter()


def parsePDF(file: File):
    try:
        buffer = io.BytesIO(file.file.read())
        pdf = pypdf.PdfReader(buffer)
        content = ""
        for page in pdf.pages:
            content += page.extract_text()
        return content.replace('\n', ' ').replace('\r', '')
    except Exception as e:
        print(e)
        raise e


@router.post("/file", response_model=ExtractResponse)
async def fild(file: UploadFile = File(...)):
    print(file)
    if not file:
        raise HTTPException(status_code=400, detail="File is required.")

    try:
        content = parsePDF(file)
        if content == "":
            raise HTTPException(status_code=500, detail="Could not extract text from the file.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return ExtractResponse(content=content)

