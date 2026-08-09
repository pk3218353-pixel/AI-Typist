"""
Optional image preprocessing before OCR (FREE — OpenCV).

Improves contrast and sharpness for photographed documents.
"""
import io

import cv2
import numpy as np
from PIL import Image


def preprocess_image(image_bytes: bytes) -> bytes:
    """
    Apply grayscale, denoise, and adaptive thresholding to improve OCR accuracy.

    Returns processed image as PNG bytes.
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        return image_bytes

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)
    thresh = cv2.adaptiveThreshold(
        denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )

    pil_img = Image.fromarray(thresh)
    buffer = io.BytesIO()
    pil_img.save(buffer, format="PNG")
    return buffer.getvalue()
