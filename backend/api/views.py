
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
import pytesseract
from PIL import Image, UnidentifiedImageError
import sympy
import os

# Create your views here.

def hello_world(request):
    return JsonResponse({'message': 'Hello, world!'})

def upload_test_page(request):
    return render(request, 'upload_test.html')

def home_page(request):
    return render(request, 'home.html')

class ImageUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        image = request.FILES.get('image')
        if not image:
            return Response({'success': False, 'error': 'No image uploaded.'}, status=400)
        if not image.content_type.startswith('image/'):
            return Response({'success': False, 'error': 'File is not an image.'}, status=400)
        path = default_storage.save('uploads/' + image.name, image)
        full_path = default_storage.path(path)
        try:
            img = Image.open(full_path)
        except UnidentifiedImageError:
            default_storage.delete(path)
            return Response({'success': False, 'error': 'Uploaded file is not a valid image.'}, status=400)
        try:
            text = pytesseract.image_to_string(img)
        except Exception as e:
            default_storage.delete(path)
            return Response({'success': False, 'error': f'OCR failed: {e}'}, status=500)
        solution = None
        try:
            expr = sympy.sympify(text.strip())
            solution = str(sympy.simplify(expr))
        except Exception as e:
            solution = f"Could not solve: {e}"
        # Clean up the uploaded file
        default_storage.delete(path)
        return Response({
            'success': True,
            'extracted_text': text,
            'solution': solution
        })
