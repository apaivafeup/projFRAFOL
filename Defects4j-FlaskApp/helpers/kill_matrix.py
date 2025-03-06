import re
from typing import List, Dict
from models import Tool, Project
from helpers import file_paths as fp
from helpers import defects4j_helper as d4jh
from helpers import tree_sitter_java as tsj


def extract_specific_test(java_code, test_name):
    pattern = rf'(?:@Test\s*\n\s*)?public void ({re.escape(test_name)})\s*\(.*?\)\s*\{{.*?\}}'
    match = re.search(pattern, java_code, re.DOTALL)
    return match.group(0) if match else None

def create_placeholder_class(test_method_code, variables, lifecycle_methods=None, helper_methods=None):
    """Creates a valid test class without unnecessary wrappers."""

    set_up_method = lifecycle_methods.get('setUp', '') if lifecycle_methods else ''
    tear_down_method = lifecycle_methods.get('tearDown', '') if lifecycle_methods else ''    
    formatted_lifecycle_methods = ''
    if set_up_method:
        formatted_lifecycle_methods += f"@Override\nprotected void setUp() throws Exception {set_up_method}\n"
    if tear_down_method:
        formatted_lifecycle_methods += f"@Override\nprotected void tearDown() throws Exception {tear_down_method}\n"

    class_template = """
public class PlaceholderTest extends TestCase {
"""

    # Add global variables
    for var in variables:
        class_template += f"\n    {var}"
    
    for method_body in helper_methods: 
        class_template += f"\n\n    {method_body.get('method_body')}"

    # Add lifecycle and helper methods
    class_template += f"""

    {formatted_lifecycle_methods}

    
    {test_method_code}  // Insert test method directly
}}
"""

    return class_template




def generate_kill_matrix(project: Project, tool: Tool) -> Dict[str, List[str]]:
    with open(fp.student_test_file_path, 'r') as file:
        java_code = file.read()

    test_method_bodies, non_tests = tsj.extract_test_methods(java_code)  
    lifecycle_methods = tsj.extract_lifecycle_methods(java_code)
    helper_methods = tsj.extract_helper_methods(java_code, test_method_bodies)
    print(f"Extracted Test Methods: {test_method_bodies}") 
    print(f"Extracted Lifecycle Methods: {lifecycle_methods}")  
    print(f"Extracted Helper Methods: {helper_methods}")

    all_imports = re.findall(r'import .*;', java_code)
    all_imports = '\n'.join(all_imports)

    variables = tsj.extract_global_variables(java_code)
    print(f"Extracted Global Variables: {variables}")  

    package = re.search(r'package\s+([\w\.]+);', java_code)
    if package:
        all_imports = f"package {package.group(1)};\n" + all_imports

    kill_matrix: Dict[str, List[str]] = {}
    all_killed_mutants = set()  

    for test_method in test_method_bodies:
        test_method_code = test_method['method_body']
        test_method_name = test_method['method_name']
        #test_throws_clause = test_method['throws_clause']
        print(f"Running kill matrix analysis for {test_method_name}: \n\n")

        placeholder_test = create_placeholder_class(test_method_code, variables, lifecycle_methods=lifecycle_methods, 
                                                    helper_methods=non_tests)

        with open(fp.placeholder_test_file_path, 'w') as file:
            file.write(all_imports  + '\n' + placeholder_test)
            print(all_imports + '\n' + placeholder_test)

        project.clear_project_tools_output()
        try:
            d4jh.run_kill_matrix_analysis(project.name_version, tool.name)

            mutants_killed_by_this_test: List[str] = tool.get_mutants_killed_by_test(project.name_version)
            kill_matrix[test_method_name] = mutants_killed_by_this_test
            all_killed_mutants.update(mutants_killed_by_this_test) 
        except Exception as e:
            print(f"Error in running kill matrix analysis: {e}")
            kill_matrix[test_method_name] = []

    return kill_matrix, list(all_killed_mutants)

