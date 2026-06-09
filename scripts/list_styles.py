import docx

def list_styles(path):
    doc = docx.Document(path)
    print("--- Styles in template ---")
    for s in doc.styles:
        if s.type == docx.enum.style.WD_STYLE_TYPE.PARAGRAPH:
            print(f"Paragraph Style: {s.name}")

list_styles(r"C:\Users\Ollie\Documents\Projects\ND3 Website\neurodivers3_template_light.docx")
