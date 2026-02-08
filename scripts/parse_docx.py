import os
import json
import re
from docx import Document

# DIRECTORY SETUP
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__)) # .../combate-prompter/scripts
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)              # .../combate-prompter
DOCS_DIR = os.path.join(os.path.dirname(PROJECT_ROOT), 'docs') # .../01_research/docs
OUTPUT_FILE = os.path.join(PROJECT_ROOT, 'src', 'data', 'fullData.json')

def extract_text_from_docx(docx_path):
    """
    Extracts full text from a DOCX file, preserving loose structure.
    """
    try:
        doc = Document(docx_path)
        full_text = []
        for para in doc.paragraphs:
            if para.text.strip():
                full_text.append(para.text.strip())
        return '\n'.join(full_text)
    except Exception as e:
        print(f"Error reading {docx_path}: {e}")
        return ""

def parse_blocks(text):
    """
    Parses text into blocks based on 'BLOQUE X:' pattern.
    """
    lines = text.split('\n')
    blocks = []
    current_block = None
    buffer = []

    for line in lines:
        # Check for Block Header
        # Using a more flexible check for "BLOQUE" at start of line
        if re.match(r'^BLOQUE\s+\d+', line, re.IGNORECASE):
             if current_block:
                 current_block["content"] = '\n'.join(buffer).strip()
                 blocks.append(current_block)
             
             current_block = {
                 "title": line.strip(),
                 "content": ""
             }
             buffer = [line.strip()] # Include title in content for context
        else:
            if current_block:
                buffer.append(line)
            else:
                 # Capture Intro before first block
                 if not blocks and line.strip() and "SEG" not in line.upper():
                     current_block = { "title": "INTRODUCCIÓN", "content": "" }
                     buffer.append(line)
    
    if current_block:
        current_block["content"] = '\n'.join(buffer).strip()
        blocks.append(current_block)
        
    return blocks

def parse_fichas(text):
    """
    Parses text into Fichas based on 'FICHA' pattern.
    """
    fichas = {}
    parts = re.split(r'(?=FICHA)', text, flags=re.IGNORECASE)
    
    count = 0
    for part in parts:
        if not part.strip(): continue
        
        lines = part.strip().split('\n')
        title = lines[0].strip()
        content = '\n'.join(lines[1:]).strip()
        
        key = f"ficha_{count}"
        fichas[key] = {
            "title": title,
            "content": content
        }
        count += 1
    return fichas

def main():
    print("GOOGLE ANTIGRAVITY STARTS DOCX PARSING...")
    
    if not os.path.exists(DOCS_DIR):
        print(f"CRITICAL ERROR: Docs directory not found at {DOCS_DIR}")
        return

    segments = []
    
    # Get all docx files sorted
    files = sorted([f for f in os.listdir(DOCS_DIR) if f.endswith('.docx') and not f.startswith('~') and 'master' not in f.lower()])
    
    # Mapping structure
    # Key: seg_id (e.g., "seg1")
    # Value: { "main": path, "fichas": path, "title": title }
    segment_map = {}
    
    # Regex for strict naming convention: sXXeXX-...-segXX(-fichascombate)?.docx
    # Example: s11e03-venustianocarranza-seg02.docx
    # Example: s11e03-venustianocarranza-seg02-fichascombate.docx
    
    for filename in files:
        # Extract Segment Number
        seg_match = re.search(r'seg(\d+)', filename, re.IGNORECASE)
        if not seg_match:
            continue
            
        seg_num = int(seg_match.group(1))
        seg_id = f"seg{seg_num}"
        
        if seg_id not in segment_map:
            segment_map[seg_id] = { "main": None, "fichas": None, "title": filename }
        
        path = os.path.join(DOCS_DIR, filename)
        
        if "fichascombate" in filename.lower() or "fichas" in filename.lower():
            segment_map[seg_id]["fichas"] = path
        else:
            segment_map[seg_id]["main"] = path
            # We assume the main file holds the "official" title of the segment file
            segment_map[seg_id]["title"] = filename

    # Process each segment in numerical order
    for seg_id in sorted(segment_map.keys(), key=lambda x: int(x.replace('seg', ''))):
        print(f"Processing {seg_id}...")
        data = segment_map[seg_id]
        
        seg_obj = {
            "id": seg_id,
            "title": data["title"], 
            "blocks": [],
            "fichas": {}
        }
        
        # Process Main Doc
        if data["main"]:
            main_text = extract_text_from_docx(data["main"])
            seg_obj["blocks"] = parse_blocks(main_text)
            
        # Process Fichas Doc
        if data["fichas"]:
            ficha_text = extract_text_from_docx(data["fichas"])
            seg_obj["fichas"] = parse_fichas(ficha_text)
            
        segments.append(seg_obj)

    full_data = {
        "title": "S11E03 - Venustiano Carranza (DOCX SOURCE)",
        "segments": segments
    }
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(full_data, f, indent=2, ensure_ascii=False)
        
    print(f"SUCCESS: Generated {OUTPUT_FILE} with {len(segments)} segments.")

if __name__ == "__main__":
    main()
