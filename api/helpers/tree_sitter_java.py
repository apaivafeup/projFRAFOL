from tree_sitter import Language, Parser
import tree_sitter_java as tsj

JAVA_LANGUAGE = Language(tsj.language())
parser = Parser(JAVA_LANGUAGE)



def parse_java_code(java_code):
    tree = parser.parse(bytes(java_code, "utf8"))
    return tree

 
def extract_test_methods(java_code: str):
    tree = parse_java_code(java_code)
    """Extracts test methods from a parsed Java class."""
    test_methods = []
    class_body = None
    all_methods = []
    
    def traverse(node, is_inside_test=False):
        nonlocal class_body
        if node.type == "class_body":
            class_body = node
        elif node.type in ["method_declaration", "field_declaration", "enum_declaration", 
                           "constructor_declaration", "static_initializer"]:
            if node.type == "method_declaration":
                method_name = java_code[node.child_by_field_name("name").start_byte : node.child_by_field_name("name").end_byte]
                if method_name.startswith("test"):  
                    test_methods.append((method_name, node))
                    is_inside_test = True
                else:
                    if not is_inside_test:
                        all_methods.append(node)
            else:
                if not is_inside_test:
                    all_methods.append(node)

        for child in node.children:
            traverse(child, is_inside_test)
    
    traverse(tree.root_node)
    return test_methods, all_methods, class_body

