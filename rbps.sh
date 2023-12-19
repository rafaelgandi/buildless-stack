#!/bin/bash



# NOT FINISHED YET.. still trying to find a way to run it on any directory


# 1. BEFORE USING THIS SCRIPT MAKE SURE TO GIVE IT AN EXECUTABLE PERMISSION
# chmod +x ./rbp.sh  
#
# 2. Move this file to /usr/local/bin to be able to call it from any directory/
#


# Check if filename argument is provided
if [ -z "$1" ]; then
  echo "Please provide a filename as an argument."
  exit 1
fi

currentDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
# Get the filename from the argument
componentName="$1"
js_file="${currentDir}/${componentName}/${componentName}.js"
style_file="${currentDir}/${componentName}/${componentName}.styles.js"

echo "$js_file";

# Check if the file already exists
if [ -e "$js_file" ]; then
  echo "File already exists: $js_file"
  exit 1
fi


generate_string() {
  local length=8
  local first_char=_
  local random_string=$(openssl rand -hex "$length" | tr -dc 'a-zA-Z0-9' | fold -w "$length" | head -n 1)
  echo "$first_char$random_string"
}
cssClassNameStr=$(generate_string)



# Create the directory if it doesn't exist
mkdir -p "$(dirname "$js_file")"



# Create the JavaScript file and write the React component
cat << EOF > "$js_file"
import { html } from 'preact-htm';
import './$componentName.styles.js';

/* * @param {import("../../types.d.ts").${componentName}Props} props */
export default function $componentName(props) {
    return html\`
        <div class="$cssClassNameStr"></div>
    \`;
}
EOF


# Create the styles js file
cat << EOF > "$style_file"
import styled from 'styled';
export default styled\`
    .$cssClassNameStr {
        
    }
\`;
EOF

echo "|-- $js_file"
echo "|-- $style_file"
echo "Component boilerplate created! 🤖✨"