import re
from tree_sitter import Language, Parser
import tree_sitter_java as tsj

JAVA_LANGUAGE = Language(tsj.language())
parser = Parser(JAVA_LANGUAGE)



def parse_java_code(java_code):
    tree = parser.parse(bytes(java_code, "utf8"))
    return tree


def extract_test_methods(java_code):
    """
    Extracts test methods (methods starting with 'test') and non-test methods (excluding setup/teardown).
    
    Args:
        java_code: Java code as a string

    Returns:
        test_methods: List of dictionaries containing the method name and body of each test method
        non_test_methods: List of dictionaries containing the method name and body of each non-test method.
    """

    # Pattern to match test methods (public void testSomething())
    test_method_pattern = re.compile(
        r'^\s*(?:public|protected)\s+void\s+(test\w+)\s*\([^)]*\)\s*(throws\s+[^{]+)?\s*\{',
        re.MULTILINE
    )

    # Pattern to match all void methods (excluding test methods)
    non_test_method_pattern = re.compile(
        r'^\s*(?:public|private|protected|static|final|synchronized|abstract|native|strictfp)?\s*'
        r'void\s+([a-zA-Z_]\w*)\s*\([^)]*\)\s*(throws\s+[^{]+)?\s*\{',
        re.MULTILINE
    )

    test_methods = []
    non_test_methods = []

    for match in test_method_pattern.finditer(java_code):
        method_name = match.group(1)
        start_idx = match.start()
        method_body = extract_full_body(java_code, start_idx)

        test_methods.append({
            'method_name': method_name,
            'method_body': method_body.strip()
        })

    for match in non_test_method_pattern.finditer(java_code):
        method_name = match.group(1)
        if method_name not in {"setUp", "tearDown"} and not method_name.startswith("test"):  # Exclude setup/teardown
            start_idx = match.start()
            method_body = extract_full_body(java_code, start_idx)

            non_test_methods.append({
                'method_name': method_name,
                'method_body': method_body.strip()
            })

    return test_methods, non_test_methods


def extract_full_body(java_code, start_index):
    """
    Extracts the full method body while ensuring balanced curly braces.
    """
    brace_count = 0
    inside_string = False
    escape_next = False

    for i in range(start_index, len(java_code)):
        char = java_code[i]

        if char == '"' and not escape_next:
            inside_string = not inside_string  # Toggle string state

        escape_next = (char == '\\' and not escape_next)

        if not inside_string:
            if char == '{':
                brace_count += 1
            elif char == '}':
                brace_count -= 1
                if brace_count == 0:
                    return java_code[start_index:i + 1]  # Return full method body

    return java_code[start_index:]  # Fallback if braces are unbalanced


def extract_lifecycle_methods(java_code):
    tree = parse_java_code(java_code)
    root_node = tree.root_node

    lifecycle_methods = {
        'setUp': '',
        'tearDown': ''
    }

    def walk(node):
        for child in node.children:
            if child.type == 'method_declaration':
                method_name = ''
                method_body = ''

                # Extract method name
                for grandchild in child.children:
                    if grandchild.type == 'identifier':
                        method_name = java_code[grandchild.start_byte:grandchild.end_byte]

                # Extract method body
                for grandchild in child.children:
                    if grandchild.type == 'block':
                        method_body = java_code[grandchild.start_byte:grandchild.end_byte]

                # Capture setUp or tearDown methods
                if method_name in ['setUp', 'tearDown']:
                    lifecycle_methods[method_name] = method_body

            walk(child)

    walk(root_node)
    return lifecycle_methods


def extract_constructors(java_code):
    pattern = r'public\s+\w+\s*\([^)]*\)\s*\{[^{}]*\}'
    matches = re.findall(pattern, java_code, re.DOTALL)
    return matches

def extract_test_suite(java_code):
    pattern = r'public\s+static\s+Test\s+suite\s*\(\)\s*\{[^{}]*\}'
    match = re.search(pattern, java_code, re.DOTALL)
    return match.group(0) if match else None


def extract_static_variables(java_code):
    # Capture both static variable declaration and static block (initialization)
    pattern = r'private\s+static\s+final\s+long\s+\w+\s*;\s*static\s*\{[\s\S]*?\}'
    matches = re.findall(pattern, java_code, re.DOTALL)
    return matches


def extract_global_variables(java_code):
    tree = parse_java_code(java_code)
    root_node = tree.root_node

    global_vars = []

    def walk(node):
        for child in node.children:
            if child.type == 'field_declaration':
                modifiers = []
                var_type = ''
                
                # Extract modifiers (e.g., static, final)
                # Extract modifiers (e.g., static, final, private, public)
                for grandchild in child.children:
                    if 'modifier' in grandchild.type:  # Some parsers may use 'access_modifier'
                        modifiers.append(java_code[grandchild.start_byte:grandchild.end_byte])


                # Extract variable type
                # Extract variable type, including generic types (e.g., Map<String, Integer>)
                for grandchild in child.children:
                    if grandchild.type in ('type_identifier', 'primitive_type', 'array_type', 'generic_type'):
                        var_type = java_code[grandchild.start_byte:grandchild.end_byte]


                # Extract all variable declarators in the same line
                for grandchild in child.children:
                    if grandchild.type == 'variable_declarator':
                        var_name_node = grandchild.child_by_field_name('name')
                        var_value_node = grandchild.child_by_field_name('value')

                        var_name = java_code[var_name_node.start_byte:var_name_node.end_byte] if var_name_node else ''
                        var_value = java_code[var_value_node.start_byte:var_value_node.end_byte] if var_value_node else ''

                        
                        if var_type and var_name:
                            modifiers_str = ' '.join(modifiers)
                            if var_value:
                                global_vars.append(f"{modifiers_str} {var_type} {var_name} = {var_value};")
                            else:
                                global_vars.append(f"{modifiers_str} {var_type} {var_name};")
            elif child.type == 'enum_declaration':  
                enum_name = None
                modifiers = []
                enum_body = None

                # Extract modifiers (e.g., public, private)
                for grandchild in child.children:
                    if 'modifier' in grandchild.type:
                        modifiers.append(java_code[grandchild.start_byte:grandchild.end_byte])

                # Extract the enum name
                for grandchild in child.children:
                    if grandchild.type == 'identifier':  
                        enum_name = java_code[grandchild.start_byte:grandchild.end_byte]

                # Extract the enum body (values inside the enum)
                for grandchild in child.children:
                    if grandchild.type == 'enum_body':
                        enum_body = java_code[grandchild.start_byte:grandchild.end_byte]

                if enum_name:
                    modifiers_str = ' '.join(modifiers)
                    global_vars.append(f"{modifiers_str} enum {enum_name} {enum_body}" if enum_body else f"{modifiers_str} enum {enum_name};")

            walk(child)

    walk(root_node)
    return global_vars


