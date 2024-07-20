#!/bin/bash


# Generate react or preact component boilerplate files.
#
#######################################################################################
#
# 1.) Before running this script make sure it has executable permission by running:
# chmod +x ./rbp.sh  
#
# 2.) Add an alias to yout .zshrc file. Open ~/.zshrc and add the code below:
# alias rbps="/The/path/to/your/rbps.sh"
#
# 3.) Refresh your terminal source by running:
# source ~/.zshrc
#
#######################################################################################

# Check if filename argument is provided
if [ -z "$1" ]; then
  echo "Please provide a component name as an argument."
  exit 1
fi

# Get the filename from the argument
componentName="$1"
js_file="${PWD}/${componentName}/${componentName}.js"
style_file="${PWD}/${componentName}/${componentName}.styles.js"

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





# Create the component directory if it doesn't exist
mkdir -p "$(dirname "$js_file")"






# Create the JavaScript file and write the React component
cat << EOF > "$js_file"
import { html } from 'preact-htm';
import './$componentName.styles.js';

/* ts */`
type ${componentName}Props = {
    children: any;  
};
`;
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




# Echo out the results
echo "|-- $js_file"
echo "|-- $style_file"
echo "Component boilerplate created! 🤖✨"