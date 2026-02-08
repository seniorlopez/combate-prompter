import os
import re
import json
import sys

def standardize_data():
    """
    GOOGLE ANTIGRAVITY PROTOCOL
    source: src/data/fullData.js (JS Module)
    target: src/data/fullData.json (Strict JSON)
    """
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    source_path = os.path.join(project_root, 'src', 'data', 'fullData.js')
    target_path = os.path.join(project_root, 'src', 'data', 'fullData.json')

    print(f"Reading source: {source_path}")

    try:
        with open(source_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Regex to extract the JSON object
        # Pattern: export const fullData = ({...});
        # We rely on the fact that existing file was generated via JSON.stringify
        match = re.search(r'export const fullData = (\{.*\});', content, re.DOTALL)
        
        if match:
            json_str = match.group(1)
            # Parse it to ensure validity
            data = json.loads(json_str)
            
            # Save as Strict JSON
            with open(target_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"SUCCESS: Data standardized to {target_path}")
            return True
        else:
            print("ERROR: Could not extract JSON payload from JS file.")
            sys.exit(1)

    except Exception as e:
        print(f"CRITICAL FAILURE: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    standardize_data()
