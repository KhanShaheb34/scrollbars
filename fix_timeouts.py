import os
import re

root_dir = 'test/Scrollbars'
# Regex patterns
# Match }, followed by optional whitespace, then 0);
replacements = [
    (r'\}\,\s*0\)\;', '}, 200);'), 
    (r'\}\,\s*50\)\;', '}, 200);'),
    (r'\}\,\s*100\)\;', '}, 400);'),
    (r'setTimeout\(\(\) => callback\(ref\.current\)\, 50\)\;', 'setTimeout(() => callback(ref.current), 200);')
]

for dirpath, dirnames, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith('.js'):
            filepath = os.path.join(dirpath, filename)
            with open(filepath, 'r') as f:
                content = f.read()
            
            new_content = content
            for pattern, subst in replacements:
                new_content = re.sub(pattern, subst, new_content)
            
            if new_content != content:
                print(f"Updating {filepath}")
                with open(filepath, 'w') as f:
                    f.write(new_content)
