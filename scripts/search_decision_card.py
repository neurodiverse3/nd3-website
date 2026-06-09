import os

def search_text():
    build_path = r"C:\Users\Ollie\Documents\PDF Generator\sensory-workbook\build.js"
    with open(build_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for i, line in enumerate(lines):
        if 'decision' in line.lower() or 'card' in line.lower():
            print(f"{i+1}: {line.strip()}")

search_text()
