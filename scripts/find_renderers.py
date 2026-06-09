import os

def find_renderers():
    build_path = r"C:\Users\Ollie\Documents\PDF Generator\sensory-workbook\build.js"
    with open(build_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    in_renderers = False
    for i, line in enumerate(lines):
        if 'const RENDERERS = {' in line or 'let RENDERERS = {' in line or 'var RENDERERS = {' in line or 'RENDERERS = {' in line:
            in_renderers = True
        if in_renderers:
            print(f"{i+1}: {line}", end='')
            if '};' in line and not '{' in line:
                in_renderers = False

find_renderers()
